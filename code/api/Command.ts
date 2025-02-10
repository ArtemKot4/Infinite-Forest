abstract class Command {
    public static list: Record<string, Command> = {};

    public caller: string;
    public arguments: string[];
    public require_count: number;

    constructor(caller: string, args?: string[], require_count?: number) {
        this.caller = caller;
        this.arguments = args || [];
        this.require_count = require_count || this.arguments.length;

        Command.list[caller] = this;
    };

};

abstract class ClientCommand<T extends Object> extends Command {
    constructor(caller: string, args?: string[], require_count?: number) {
        super(caller, args, require_count)
    };

    abstract onCall(data: T): void;
    abstract onCall(): void;
};

abstract class ServerCommand<T extends Object> extends Command {
    constructor(caller: string, args?: string[], require_count?: number) {
        super(caller, args, require_count);
        this.buildPacket();
    };

    public onClient(data: T): void {
        return null;
    };

    abstract onServer(client: NetworkClient, data: T): void;

    public buildPacket(): void {
        Network.addClientPacket("packet.command.client." + this.caller, this.onClient.bind(this));
        Network.addServerPacket("packet.command.server." + this.caller, this.onServer.bind(this));
    };

    public sendToClient(client: NetworkClient, data: T): void {
        if(client) {
            client.send("packet.command.client." + this.caller, data);
        };
    };

    public sendMessageToClient(client: NetworkClient, message: string): void {
        if(client) {
            client.sendMessage(Translation.translate(message));
        };
    }

    public sendToAllClients(data: T): void {
        Network.sendToAllClients("packet.command.client." + this.caller, data);
    };
};

Callback.addCallback("NativeCommand", (command) => {
    const splited = command.split(" "); 

    for(const i in Command.list) {
        const current = Command.list[i];

        if("/" + current.caller === splited[0]) {
            const args = splited.splice(1);

            if(current.require_count <= 0 || args.length >= current.require_count) {
                Game.prevent();

                const arguments = args.slice(0, Math.min(args.length, current.arguments.length))
                .reduce<Record<string, any>>((previousValue, currentValue, currentIndex) => {
                    previousValue[current.arguments[currentIndex]] = currentValue;
                    return previousValue;
                }, {});

                if(current instanceof ServerCommand) {
                    Network.sendToServer("packet.command.server." + current.caller, arguments);
                    return;
                };

                if(current instanceof ClientCommand) {
                    current.onCall(arguments);
                    return;
                };

            } else {
                const message = Translation.translate("command.not_enough_arguments")
                .replace("%s", current.require_count.toString())
                .replace("%d", current.arguments.length.toString());

                Game.message(Native.Color.RED + message)
                Game.prevent();
            };
        };
    };
});

Translation.addTranslation("command.not_enough_arguments", {
    en: "Not enough arguments. You need %s arguments, but you gave %d",
    ru: "Недостаточно аргументов. Вам нужно %s аргументов, но вы предоставили %d",
});

interface ILearningCommandProps {
    action?: string;
    name?: string;
};

class LearningCommand extends ServerCommand<ILearningCommandProps> {
    public constructor() {
        super("if:learning", ["action", "name"], 1);
    };

    public override onServer(client: NetworkClient, data: ILearningCommandProps): void {
        if(!data) return;
        if(!data.action) return;

        const playerUid = client.getPlayerUid();
        const player = ObjectPlayer.getOrCreate(playerUid);

        if(data.action === "clear") {
            if('name' in data) {
                delete player.learningList[data.name]
            } else {
                player.learningList = {};
            };
            ObjectPlayer.sendToClient(playerUid);
            Notification.sendFor(playerUid, "learning", Translation.translate("message.infinite_forest.clear_learnings"), "amulet_lock");
        };

        if(data.action === "add") {
            if(!data.name) return;

            if(data.name === "all") {
                for(const learning_name of Object.keys(Learning.list)) {
                    ObjectPlayer.addLearning(playerUid, learning_name);
                };
                return;
            };
            ObjectPlayer.addLearning(playerUid, data.name);
        };
    };
};

new LearningCommand();

Translation.addTranslation("message.infinite_forest.clear_learnings", {
    en: "Your learnings cleared",
    ru: "Ваши изучения удалены",
});
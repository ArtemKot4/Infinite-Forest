LIBRARY({
    name: "CommandHelper",
    version: 1,
    shared: true,
    api: "CoreEngine"
});

type ArgumentTypes = "string" | "number" | "boolean" | "any";

abstract class Command {
    public static list: Record<string, Command> = {};

    public caller: string;
    public arguments: Record<string, ArgumentTypes>;
    public require_count: number;

    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        this.caller = caller;
        this.arguments = args || {};
        this.require_count = require_count || Object.keys(this.arguments).length;

        Command.list[caller] = this;
    };

};

interface ICommandParams {
    /**
     * Entity list got from native format: 
     * @s caller
     * @p caller
     * @a all players
     * @e all entities
     * Must be registered in constructor.
     */
    entities?: {
        entities: number[] | [],
        players: number[] | [],
        caller: [number]
    };
}

abstract class ClientCommand<T extends ICommandParams> extends Command {
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        super(caller, args, require_count)
    };

    abstract onCall(data: T): void;
    abstract onCall(): void;
};

abstract class ServerCommand<T extends ICommandParams> extends Command {
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        super(caller, args, require_count);
        this.buildPacket();
    };

    public onClient(data: T): void {
        return null;
    };

    abstract onServer(client: NetworkClient, data: T): void;

    public buildPacket(): void {
        Network.addClientPacket("packet.command.client." + this.caller, this.onClient.bind(this));
        Network.addServerPacket("packet.command.server." + this.caller, (client, data: T) => {
            for(const i in data) {
                const argument_name = i as string;
                if(argument_name.startsWith("entities")) {
                    const value = data[argument_name] as string;

                    const obj = {
                        entities: [],
                        players: [],
                        caller: [client.getPlayerUid()]
                    };

                    if(typeof Number(value) !== "number") {
                        if(!value.startsWith("@")) {
                            const error = Translation.translate("command.invalid_search_entities")
                            .replace("%s", argument_name);
                                
                            client.sendMessage(Native.Color.RED + error);
                        };

                        switch(value.slice(0, 2)) {
                            case "@s": {
                                continue;
                            };
                            case "@p": {
                                continue;
                            };
                            case "@a": {
                                const players = Network.getConnectedPlayers()
                                const list = [];

                                for(const i in players) {
                                    list.push(Number(players[i]));
                                };

                                obj.players = list;
                                break;
                            };
                            case "@e": {
                                let list = null;
                                const blockSource = BlockSource.getDefaultForActor(client.getPlayerUid());
                                const radius = Number(value.slice(3, -1).split("r=")[1]);

                                if(radius && radius > 0) {
                                    const position = Entity.getPosition(client.getPlayerUid());
                                    const radius_multipliered = radius * 2;
                                    
                                    list = blockSource.listEntitiesInAABB(
                                        position.x - radius, 
                                        position.y - radius, 
                                        position.z - radius, 
                                        position.x + radius_multipliered, 
                                        position.y + radius_multipliered, 
                                        position.z + radius_multipliered
                                    );
                                } else {
                                    list = Entity.getAll();
                                };

                                obj.entities = list;                     
                            };
                        };
                    };

                    data[argument_name] = obj;
                };
            };
            return this.onServer(client, data);
        });
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
                const arguments_name = Object.keys(current.arguments);
                const arguments_type = Object.values(current.arguments);

                const arguments = args.slice(0, Math.min(args.length, arguments_name.length))
                .reduce<Record<string, any>>((result, currentValue, currentIndex) => {
                    let res;

                    switch(arguments_type[currentIndex]) {
                        case "boolean": {
                            if(currentValue === "true") {
                                res = true;
                            } else if(currentValue === "false") {
                                res = false;
                            } else {
                                const error = Translation.translate("command.invalid_boolean_type")
                                .replace("%s", arguments_name[currentIndex]);
                                
                                Game.message(Native.Color.RED + error);
                                return;
                            };
                            break;
                        };
                        case "string": {
                            res = currentValue;
                            break;
                        };
                        case "number": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                const error = Translation.translate("command.invalid_number_type")
                                .replace("%s", arguments_name[currentIndex]);

                                Game.message(Native.Color.RED + error);
                                return;
                            };
                            break;
                        };
                        case "any": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                res = currentValue;
                            };
                            break;
                        };
                    };
                    
                    result[arguments_name[currentIndex]] = res;
                    return result;
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
                Game.prevent();

                const message = Translation.translate("command.not_enough_arguments")
                .replace("%s", current.require_count.toString())
                .replace("%d", current.arguments.length.toString());

                Game.message(Native.Color.RED + message)
            };
        };
    };
});

Translation.addTranslation("command.not_enough_arguments", {
    en: "Not enough arguments. You need %s arguments, but you gave %d",
    ru: "Недостаточно аргументов. Вам нужно %s аргументов, но вы предоставили %d",
});

Translation.addTranslation("command.invalid_boolean_type", {
    en: "Error! Invalid type of argument %s. It will be boolean (true/false)",
    ru: "Ошибка! Неправильный тип аргумента %s. Он должен быть типа boolean (true/false)"
});

Translation.addTranslation("command.invalid_number_type", {
    en: "Error! Invalid type of argument %s. It will be number",
    ru: "Ошибка! Неправильный тип аргумента %s. Он должен быть типа number"
});

Translation.addTranslation("command.invalid_search_entities", {
    en: "Error! Invalid search entities format. Use @s or @p or @a or @e",
    ru: "Ошибка! Неправильный запрос по сущностям. Используйте @s или @p или @a или @e"
});

EXPORT("Command", Command);
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
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
            let text = Translation.translate("message.infinite_forest.clear_learnings");

            if('name' in data) {
                text = Translation.translate("message.infinite_forest.clear_learning")
                .replace("%s", Translation.translate(`learning.infinite_forest.${data.name}`));
                
                delete player.learningList[data.name];
            } else {
                player.learningList = {};"message.infinite_forest.clear_learning"
            };
            ObjectPlayer.sendToClient(playerUid);
            Notification.sendFor(playerUid, "learning", text, "amulet_lock");
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

Translation.addTranslation("message.infinite_forest.clear_learning", {
    en: "Learning %s cleared",
    ru: "Изучение %s удалено",
});
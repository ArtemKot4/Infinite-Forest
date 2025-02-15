interface ILearningCommandProps {
    action?: string;
    name?: string;
};

class LearningCommand extends ServerCommand<ILearningCommandProps> {
    public constructor() {
        super("if:learning", ["action", "name"], 1);
    };

    public override onServer(client: NetworkClient, data: ILearningCommandProps): void {
        const playerUid = client.getPlayerUid();
        const player = ObjectPlayer.getOrCreate(playerUid);

        if(data.action === "clear") {
            let text = Translation.translate("message.infinite_forest.clear_learnings");

            if('name' in data) {
                const learningText = Translation.translate(`learning.infinite_forest.${data.name}`);

                text = Translation.translate("message.infinite_forest.clear_learning")
                .replace("%s", learningText.length > 10 ? learningText.slice(0, 10) + "..." : learningText);
                
                Learning.deleteFor(playerUid, data.name);
            } else {
                text = Translation.translate("message.infinite_forest.clear_learnings");

                player.learningList = {};
                ObjectPlayer.sendToClient(playerUid);
            };
            Notification.sendFor(playerUid, "learning", text, "amulet_lock");
            return;
        };

        if(data.action === "add") {
            if(!data.name) return;

            if(data.name === "all") {
                for(const learning_name of Object.keys(Learning.list)) {
                    Learning.giveFor(playerUid, learning_name);
                };
                return;
            };
            Learning.giveFor(playerUid, data.name);
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
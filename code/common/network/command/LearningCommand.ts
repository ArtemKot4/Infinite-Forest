interface ILearningCommandProps extends ICommandParams {
    action: string;
    name?: string;
};

class LearningCommand extends ServerCommand<ILearningCommandProps> {
    public constructor() {
        super("if:learning", {
            "action": "string", 
            "name": "string",
            "entities": "number"
        }, 1);
    };

    public override onServer(client: NetworkClient, data: ILearningCommandProps): void {
        const playersUid = 'initiator' in data ? data.initiator.players : [client.getPlayerUid()];

        for(const playerUid of playersUid) {
            const player = ObjectPlayer.getOrCreate(playerUid);

            if(data.action === "clear") {
                let text = Translation.translate("message.infinite_forest.clear_learnings");
    
                if('name' in data) {
                    const learningName = Translation.translate(`learning.infinite_forest.${data.name}`);
    
                    text = Translation.translate("message.infinite_forest.clear_learning")
                    .replace("%s", learningName.length > 10 ? learningName.slice(0, 10) + "..." : learningName);
                    
                    if(data.name in Learning.list) { 
                        Learning.deleteFor(playerUid, data.name);
                    } else {
                        const client = Network.getClientForPlayer(playerUid);

                        if(client) {
                            client.sendMessage(Native.Color.RED + Translation.translate("message.infinite_forest.unknown_learning"));
                        };
                    };
                } else {
                    text = Translation.translate("message.infinite_forest.clear_learnings");
    
                    player.learningList = {}
                    ObjectPlayer.sendToClient(playerUid)
                };
    
                Notification.get("achievement").sendFor(playerUid, "IFLearning", {
                    text: {
                        type: "text",
                        text: text
                    },
                    icon: {
                        type: "image",
                        bitmap: "amulet_lock"
                    } 
                });
                return;
            };
    
            if(data.action === "add") {
                if(!data.name) return;
    
                if(data.name === "all") {
                    for(const learning_name of Object.keys(Learning.list)) {
                        Learning.giveFor(playerUid, learning_name)
                    };
                    return;
                };
    
                Learning.giveFor(playerUid, data.name)
            };
        };
    };
};

Command.register(new LearningCommand());

Translation.addTranslation("message.infinite_forest.clear_learnings", {
    en: "Your learnings cleared",
    ru: "Ваши изучения удалены",
});

Translation.addTranslation("message.infinite_forest.clear_learning", {
    en: "Learning %s cleared",
    ru: "Изучение %s удалено",
});


Translation.addTranslation("message.infinite_forest.unknown_learning", {
    en: "Error! Unknown learning...",
    ru: "Ошибка! Неизвестное изучение...",
});
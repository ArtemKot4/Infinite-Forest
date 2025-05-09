interface ILearningCommandProps extends ICommandParams {
    action: string;
    name?: string;
}

class LearningCommand extends ServerCommand<ILearningCommandProps> {
    public constructor() {
        super("if:learning", {
            "action": "string", 
            "name": "string",
            "entities": "number"
        }, 1);
    }

    public override onServer(client: NetworkClient, data: ILearningCommandProps): void {
        const playerUid = client.getPlayerUid();
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
                        return client.sendMessage(Native.Color.RED + Translation.translate("message.infinite_forest.unknown_learning"));
                    }
                }
            } else {
                text = Translation.translate("message.infinite_forest.clear_learnings");

                player.learnings = {};
                ObjectPlayer.sendToClient(playerUid);
            }

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
        }

        if(data.action === "add") {
            if(!data.name) {
                for(const learningName of Object.keys(Learning.list)) {
                    Learning.giveFor(playerUid, learningName)
                }
                return;
            }
            Learning.giveFor(playerUid, data.name)
        }
    }
}

Command.register(new LearningCommand());
abstract class Learning {
    public static list: Record<string, LearningBase> = {};

    public static get(name: string): Nullable<LearningBase> {
        return Learning.list[name] || null;
    }

    /**
     * Server method to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
     * @param direction direction of page;
    */

    public static giveFor(playerUid: number, name: string, direction: number = -1): void {
        const learning = Learning.get(name);

        if(!learning) {
            Network.getClientForPlayer(playerUid).sendMessage(android.graphics.Color.RED + `Server: ${name} is not a learning. All exists learnings: ${Object.keys(Learning.list)}`);
            return;
        }

        const player = ObjectPlayer.getOrCreate(playerUid);
        const playerLearning = player.learnings[name];

        if(!playerLearning) {
            ObjectPlayer.sendToClient(playerUid);

            player.learnings[name] = direction;
            const item = learning.iconType == "item" && learning.icon;
            const bitmap = learning.iconType != "item" && learning.icon;
            
            Notification.sendFor(playerUid, "advancement", "infinite_forest.learning", { 
                elements: <NoteComponent item={ item } bitmap={ bitmap }>{ `learning.infinite_forest.${name}` }</NoteComponent>
            });
        }
    }

    /**
     * Server method to delete learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
    */
    
    public static deleteFor(playerUid: number, name: string): void {
        const player = ObjectPlayer.getOrCreate(playerUid);
        const playerLearning = player.learnings[name];

        if(playerLearning) {
            delete player.learnings[name];

            ObjectPlayer.sendToClient(playerUid);
        }
    }
}
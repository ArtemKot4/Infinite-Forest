abstract class Learning {
    public static list: Record<string, LearningBase> = {};

    public static get(name: string): Nullable<LearningBase> {
        return Learning.list[name] || null;
    };

    /**
     * Server method to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
     * @param direction direction of page;
    */

    public static giveFor(player_uid: number, name: string, direction: number = -1): void {
        const learning = Learning.get(name);

        if(!learning) {
            Network.getClientForPlayer(player_uid).sendMessage(`Server: ${name} is not a learning. All exists learnings: ${Object.keys(Learning.list)}`);
            return;
        };

        const player = ObjectPlayer.getOrCreate(player_uid);
        const playerLearning = player.learningList[name];

        if(!playerLearning) {
            player.learningList[name] = direction;

            ObjectPlayer.sendToClient(player_uid);
            Notification.sendFor(player_uid, "learning", `learning.infinite_forest.${name}`, learning.icon, learning.icon_type);
        };
    };

    /**
     * Server method to delete learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
    */
    
    public static deleteFor(player_uid: number, name: string): void {
        const player = ObjectPlayer.getOrCreate(player_uid);
        const playerLearning = player.learningList[name];

        if(playerLearning) {
            delete player.learningList[name];

            ObjectPlayer.sendToClient(player_uid);
        };
    };

};
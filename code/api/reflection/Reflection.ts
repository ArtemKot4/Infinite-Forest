class Reflection {
    public static list: Record<string, ReflectionBase> = {};

    public static get(name: string): Nullable<ReflectionBase> {
        return Reflection.list[name] || null;
    };

    /**
     * Server method to append reflection list of player in both sides;
     * @param id numeric id of player;
     * @param reflection reflection in database;
     * @param progress number of progress
     * @param page_direction direction of page
    */

    public static giveFor(player_uid: number, name: string, progress: number, page_direction: number): void {
        const reflection = Reflection.get(name);

        if(!reflection) {
            Network.getClientForPlayer(player_uid).sendMessage(`Server: ${name} is not reflection. All exists reflections: ${Object.keys(Reflection.list)}`);
        }
        const player = ObjectPlayer.getOrCreate(player_uid);
        const playerReflection = player.reflectionList[reflection.name];

        if(playerReflection && playerReflection.enough_attempts > 0) {
            playerReflection.enough_attempts--;
            playerReflection.progress = Math.min(playerReflection.progress + progress, 100);
    
            ObjectPlayer.sendToClient(player_uid);
            return;
        };

        player.reflectionList[reflection.name] = {
            progress,
            enough_attempts: reflection.max_attempts,
            page_direction: page_direction || 0
        };

        ObjectPlayer.sendToClient(player_uid);
    };

    /**
     * Server method to delete reflection from player list;
     * @param id numeric id of player;
     * @param reflection reflection in database;
    */
    
    public static deleteFor(player_uid: number, name: string): void {
        const player = ObjectPlayer.getOrCreate(player_uid);
        const playerReflection = player.reflectionList[name];

        if(playerReflection) {
            delete player.reflectionList[name];

            ObjectPlayer.sendToClient(player_uid);
        };
    };
};
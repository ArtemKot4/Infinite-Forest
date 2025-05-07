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

    public static giveFor(playerUid: number, name: string, progress: number, page_direction: number): void {
        const reflection = Reflection.get(name);
        if(!reflection) {
            Network.getClientForPlayer(playerUid).sendMessage(`Server: ${name} is not reflection. All exists reflections: ${Object.keys(Reflection.list)}`);
        }
        const player = ObjectPlayer.getOrCreate(playerUid);
        const playerReflection = player.reflections[reflection.name];

        if(playerReflection && playerReflection.enough_attempts > 0) {
            playerReflection.enough_attempts--;
            playerReflection.progress = Math.min(playerReflection.progress + progress, 100);
    
            ObjectPlayer.sendToClient(playerUid);
            return;
        }

        player.reflections[reflection.name] = {
            progress,
            enough_attempts: reflection.maxAttempts,
            page_direction: page_direction || 0
        };

        ObjectPlayer.sendToClient(playerUid);
    }

    /**
     * Server method to delete reflection from player list;
     * @param id numeric id of player;
     * @param reflection reflection in database;
    */
    
    public static deleteFor(playerUid: number, name: string): void {
        const player = ObjectPlayer.getOrCreate(playerUid);
        const playerReflection = player.reflections[name];

        if(playerReflection) {
            delete player.reflections[name];

            ObjectPlayer.sendToClient(playerUid);
        };
    };
};
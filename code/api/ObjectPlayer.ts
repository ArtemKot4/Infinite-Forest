interface IPlayerReflection {
    progress: number,
    enough_attempts: number,
    page_direction: number
};

interface IPlayerPage {
    title: string,
    subtitle: string,
    text: string
};

interface IEffectData {
    timer: number;
    progress: number;
    progress_max: number;
    lock?: boolean;
};

interface Learning {
    name: string
};

interface Reflection {
    name: string;
    max_attempts: number;
};

/**
 * Class to manipulate contain player data in imagination of modification;
 */

class ObjectPlayer {
    public static list: Record<number, ObjectPlayer> = {};

    protected constructor(id: number) {
        this.id = id;
        this.name = Entity.getNameTag(id);
    };

    /**
     * numeric id of player;
     */

    public id: number;

    /**
     * string name of player
     */

    public name: string;

    /**
     * list of player learnings. 
     * @key string name of learning;
     * @value number number of direction of page linked with this learning, -1 is not selected;
     */

    public learningList: Record<string, number> = {};

    /**
     * list of player reflections. Key is name of reflection, value is object with progress, enough_attempts, page_direction;
     */

    public reflectionList: { [reflection: string]: IPlayerReflection } = {};

    /**
     * list of player recorded pages. Key is name of page, value is object with title, subtitle, text;
     */

    public recordList: IPlayerPage[] = [];

    /**
     * list of player effects. Key is name of effect, value is object with timer, progress, progress_max, lock;
     */
     
    public effectList: Record<string, IEffectData> = {};

    /**
     * Server function to get effect object;
     */
    public getEffect(name: string): IEffectData {
        return this.effectList[name] ??= {
            progress: 0,
            progress_max: 100,
            timer: 0
        };
    };

    /**
     * Server function to update effect object;
     * @param name of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public setEffect(name: string, data: Partial<IEffectData>) {
        const previousData = this.effectList[name] || {
            progress: 0,
            progress_max: 100,
            timer: 0
        } satisfies IEffectData;

        this.effectList[name] = Object.assign(previousData, data);
    };

    /**
     * Server function to append list of players;
     * @param player numeric id of player;
     */

    public static appendList(player: ObjectPlayer) {
        ObjectPlayer.list ??= {};

        const key = ObjectPlayer.list[player.id];

        if(!key) {
            ObjectPlayer.list[player.id] = player;
        } else {
            key.name = Entity.getNameTag(player.id);
        };
    };

    /**
     * Server function to set player object;
     * @param player numeric id of player;
     */

    public static set(player: ObjectPlayer) {
        this.list[player.id] = player;
    };

    /**
     * Server function to append list of players;
     * @param id numeric id of player
     */

    public static create(id: number): void {
        const isValid = new PlayerActor(id).isValid();

        if(!isValid) {
            return;
        };

        this.appendList(new ObjectPlayer(id));
    };

    /**
     * Server function to get player by id;
     * @param id numeric id of player;
     */

    public static get(id: number = Player.getLocal()): Nullable<ObjectPlayer> {
        return this.list[id] || null;
    };

    public static getOrCreate(id: number): ObjectPlayer {
        return this.list[id] ??= new ObjectPlayer(id);
    }

    /**
     * Client function to create player object in server side;
     * @param id numeric id of player;
     */

    // public static createToServer(id: number): void {
    //     Network.sendToServer("packet.infinite_forest.create_object_player", { id });
    // };

    /**
     * Server function to set player object in client side;
     * @param id numeric id of player;
     */

    public static sendToClient(id: number): void {
        const client = Network.getClientForPlayer(id);

        if(client) {
            client.send("packet.infinite_forest.get_object_player", { 
                player: this.getOrCreate(id)
            });
        };
    };

    /**
     * Client function to set player object in server side;
     * @param player numeric id of player;
     */

    // public static sendToServer(player: ObjectPlayer): void {
    //     Network.sendToServer("packet.infinite_forest.set_object_player", { player });
    // };

    /**
     * Server function to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
     * @param direction direction of page;
     */

    public static addLearning(player_uid: number, learning_name: string, direction: number = -1): void {
        const learning = Learning.get(learning_name);

        if(!learning) {
            Debug.message(`Server: ${learning_name} is not a learning. All exists learnings: ${Object.keys(Learning.list)}`);
            return;
        };

        const player = this.getOrCreate(player_uid);
        const hasLearning = player.learningList[learning_name];

        if(!hasLearning) {
            player.learningList[learning_name] = direction;

            this.sendToClient(player_uid);

            Notification.sendFor(player_uid, "learning", learning_name, learning.icon, learning.icon_type);
            return;
        };
    };

    /**
     * Server function to append reflection list of player in both sides;
     * @param id numeric id of player;
     * @param reflection reflection in database;
     * @param progress number of progress
     * @param page_direction direction of page
     */

    public static addReflection(id: number, reflection: Reflection, progress: number, page_direction: number): void {
        const player = this.getOrCreate(id);
        const hasReflection = player.reflectionList[reflection.name];

        if(hasReflection) {
            if(hasReflection.enough_attempts <= 0) {
                return;
            } else {
                hasReflection.enough_attempts--;
                hasReflection.progress = Math.min(hasReflection.progress + progress, 100);
        
                this.sendToClient(id);
                return;
            }
        };

        player.reflectionList[reflection.name] = {
            progress,
            enough_attempts: reflection.max_attempts,
            page_direction: page_direction || 0
        };

        return this.sendToClient(id);
    };

    /**
     * Server function to append pagesMyself list of player in both sides;
     * @param id numeric id of player;
     * @param title title of page;
     * @param subtitle subtitle of page;
     * @param text text of page;
     */

    public static addRecord(id: number, title: string, subtitle: string, text: string): void {
        const player = this.getOrCreate(id);

        player.recordList.push({
            title,
            subtitle,
            text
        });

        this.sendToClient(id);
    };

    //next danger functions, mustn't to realize

    /**
     * Client function to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning in database;
     * @param direction of page;
     */

    // public static addLearningToServer(id: number, learning: string, direction: number): void {
    //     Network.sendToServer("packet.infinite_forest.add_learning_player", { id, learning, direction });
    // };

    /**
     * Client function to append reflection list of player in both sides;
     * @param id numeric id of player;
     * @param reflection in database;
     * @param progress number of progress;
     * @param page_direction direction of page;
     */

    // public static addReflectionToServer(id: number, reflection: Reflection, progress: number, page_direction: number): void {
    //     Network.sendToServer("packet.infinite_forest.add_reflection_player", { id, reflection, progress, page_direction });
    // };

    /**
     * Client function to append pagesMyself list of player in both sides;
     * @param id numeric id of player;
     * @param title title of page;
     * @param subtitle subtitle of page;
     * @param text text of page;
     */

    // public static addMyPageToServer(id: number, title: string, subtitle: string, text: string): void {
    //     Network.sendToServer("packet.infinite_forest.add_my_page_player", { id, title, subtitle, text });
    // };
    public static clearList(): void {
        ObjectPlayer.list = {};
    };

    public static getList(): typeof this.list {
        return ObjectPlayer.list;
    };
};

// Network.addServerPacket("packet.infinite_forest.create_object_player", (client: NetworkClient, data: { id: number }) => {
//     ObjectPlayer.create(data.id);
// });

// Network.addServerPacket("packet.infinite_forest.set_object_player", (client: NetworkClient, data: { player: ObjectPlayer }) => {
//     ObjectPlayer.set(data.player);
// });

Network.addClientPacket("packet.infinite_forest.get_object_player", (data: { player: ObjectPlayer }) => {
    ObjectPlayer.appendList(data.player);
    // Game.message("my data: -> " + JSON.stringify(ObjectPlayer.get()));
});

// Network.addServerPacket("packet.infinite_forest.add_learning_player", (client: NetworkClient, data: { 
//     id: number, 
//     learning: string, 
//     direction: number 
// }) => {
//     return ObjectPlayer.addLearning(data.id, data.learning, data.direction);
// });

// Network.addServerPacket("packet.infinite_forest.add_reflection_player", (client: NetworkClient, data: { id: number, reflection: Reflection, progress: number, page_direction: number }) => {
//     return ObjectPlayer.addReflection(data.id, data.reflection, data.progress, data.page_direction);
// });

// Network.addServerPacket("packet.infinite_forest.add_my_page_player", (client: NetworkClient, data: { id: number, title: string, subtitle: string, text: string }) => {
//     return ObjectPlayer.addRecord(data.id, data.title, data.subtitle, data.text);
// });

Callback.addCallback("ServerPlayerLoaded", (player) => {
    ObjectPlayer.create(player);
    ObjectPlayer.sendToClient(player);
});



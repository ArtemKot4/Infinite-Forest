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
    protected static list: Record<number, ObjectPlayer> = {};

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
     * list of player learnings. Key is name of learning, value is number of direction of page linked with this learning;
     */

    public learningList: Record<string, number> = {};

    /**
     * list of player reflections. Key is name of reflection, value is object with progress, enough_attempts, page_direction;
     */

    public reflectionList: { [reflection: string]: IPlayerReflection } = {};

    /**
     * list of player self pages. Key is name of page, value is object with title, subtitle, text;
     */

    public pagesMyself: IPlayerPage[] = [];

    /**
     * Server function to append list of players;
     * @param player numeric id of player;
     */

    public static appendList(player: ObjectPlayer) {
        const key = ObjectPlayer.list[player.id];

        if(key) {
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

    public static get(id: number): Nullable<ObjectPlayer> {
        return this.list[id] || null;
    };

    public static getOrCreate(id: number): ObjectPlayer {
        return this.list[id] || new ObjectPlayer(id);
    }

    /**
     * Client function to create player object in server side;
     * @param id numeric id of player;
     */

    public static createToServer(id: number): void {
        Network.sendToServer("packet.infinite_forest.create_object_player", { id });
    };

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

    public static sendToServer(player: ObjectPlayer): void {
        Network.sendToServer("packet.infinite_forest.set_object_player", { player });
    };

    /**
     * Server function to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning learning in database;
     * @param direction direction of page;
     */

    public static addLearning(id: number, learning: Learning, direction: number): void {
        const player = this.getOrCreate(id);
        const hasLearning = player.learningList[learning.name];

        if(typeof hasLearning === "number" && hasLearning != direction) {
            player.learningList[learning.name] = direction;

            this.sendToClient(id);
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

        this.sendToClient(id);
    };

    /**
     * Server function to append pagesMyself list of player in both sides;
     * @param id numeric id of player;
     * @param title title of page;
     * @param subtitle subtitle of page;
     * @param text text of page;
     */

    public static addMyPage(id: number, title: string, subtitle: string, text: string): void {
        const player = this.getOrCreate(id);

        player.pagesMyself.push({
            title,
            subtitle,
            text
        });

        this.sendToClient(id);
    };

    /**
     * Client function to append learning list of player in both sides;
     * @param id numeric id of player;
     * @param learning in database;
     * @param direction of page;
     */

    public static addLearningToServer(id: number, learning: Learning, direction: number): void {
        Network.sendToServer("packet.infinite_forest.add_learning_player", { id, learning, direction });
    };

    /**
     * Client function to append reflection list of player in both sides;
     * @param id numeric id of player;
     * @param reflection in database;
     * @param progress number of progress;
     * @param page_direction direction of page;
     */

    public static addReflectionToServer(id: number, reflection: Reflection, progress: number, page_direction: number): void {
        Network.sendToServer("packet.infinite_forest.add_reflection_player", { id, reflection, progress, page_direction });
    };

    /**
     * Client function to append pagesMyself list of player in both sides;
     * @param id numeric id of player;
     * @param title title of page;
     * @param subtitle subtitle of page;
     * @param text text of page;
     */

    public static addMyPageToServer(id: number, title: string, subtitle: string, text: string): void {
        Network.sendToServer("packet.infinite_forest.add_my_page_player", { id, title, subtitle, text });
    };
};

Network.addServerPacket("packet.infinite_forest.create_object_player", (client: NetworkClient, data: { id: number }) => {
    ObjectPlayer.create(data.id);
});

Network.addServerPacket("packet.infinite_forest.set_object_player", (client: NetworkClient, data: { player: ObjectPlayer }) => {
    ObjectPlayer.set(data.player);
});

Network.addClientPacket("packet.infinite_forest.get_object_player", (data: { player: ObjectPlayer }) => {
    ObjectPlayer.appendList(data.player);
});

Network.addServerPacket("packet.infinite_forest.add_learning_player", (client: NetworkClient, data: { 
    id: number, 
    learning: Learning, 
    direction: number 
}) => {
    return ObjectPlayer.addLearning(data.id, data.learning, data.direction);
});

Network.addServerPacket("packet.infinite_forest.add_reflection_player", (client: NetworkClient, data: { id: number, reflection: Reflection, progress: number, page_direction: number }) => {
    return ObjectPlayer.addReflection(data.id, data.reflection, data.progress, data.page_direction);
});

Network.addServerPacket("packet.infinite_forest.add_my_page_player", (client: NetworkClient, data: { id: number, title: string, subtitle: string, text: string }) => {
    return ObjectPlayer.addMyPage(data.id, data.title, data.subtitle, data.text);
});

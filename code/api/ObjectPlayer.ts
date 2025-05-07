interface IPlayerReflection {
    progress: number,
    enough_attempts: number,
    page_direction: number
}

interface IPlayerPage {
    title: string,
    subtitle: string,
    text: string
}

interface Learning {
    name: string
}

interface Reflection {
    name: string;
    max_attempts: number;
}

/**
 * Class to manipulate contain player data in imagination of modification;
 */

class ObjectPlayer {
    public static list: Record<number, ObjectPlayer> = {};

    protected constructor(id: number) {
        this.id = id;
        this.name = Entity.getNameTag(id);
    }

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

    public learnings: Record<string, number> = {};

    /**
     * list of player reflections. Key is name of reflection, value is object with progress, enough_attempts, page_direction;
     */

    public reflections: { [reflection: string]: IPlayerReflection } = {};

    /**
     * list of player recorded pages. Key is name of page, value is object with title, subtitle, text;
     */

    public records: IPlayerPage[] = [];

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
        }
    }

    /**
     * Server function to set player object;
     * @param player numeric id of player;
     */

    public static set(player: ObjectPlayer) {
        this.list[player.id] = player;
    }

    /**
     * Server function to append list of players;
     * @param id numeric id of player
     */

    public static create(id: number): void {
        const isValid = new PlayerActor(id).isValid();

        if(!isValid) {
            return;
        }

        this.appendList(new ObjectPlayer(id));
    }

    /**
     * Server function to get player by id;
     * @param id numeric id of player;
     */

    public static get(id: number = Player.getLocal()): Nullable<ObjectPlayer> {
        return this.list[id] || null;
    }

    public static getOrCreate(id: number): ObjectPlayer {
        return this.list[id] ??= new ObjectPlayer(id);
    }

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
        }
    }
   
    /**
     * Server function to append pagesMyself list of player in both sides;
     * @param id numeric id of player;
     * @param title title of page;
     * @param subtitle subtitle of page;
     * @param text text of page;
     */

    public static addRecord(id: number, title: string, subtitle: string, text: string): void {
        const player = this.getOrCreate(id);

        player.records.push({
            title,
            subtitle,
            text
        });

        this.sendToClient(id);
    }

    public static clearList(): void {
        ObjectPlayer.list = {};
    }

    public static getList(): typeof this.list {
        return ObjectPlayer.list;
    }
}

Network.addClientPacket("packet.infinite_forest.get_object_player", (data: { player: ObjectPlayer }) => {
    ObjectPlayer.appendList(data.player);
});

Callback.addCallback("ServerPlayerLoaded", (player) => {
    ObjectPlayer.create(player);
    ObjectPlayer.sendToClient(player);
});



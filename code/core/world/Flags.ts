type IPlayerPage = Record<string, number>;

declare type playerData = {
    /**
     * List of learnings
     */
    learningList: Set<string>,
    /**
     * List of revelations. If progress == -1, revelation is broken
     * If regress > progress, revelation always will be broken, if 50 vs 50, player have a chance to complete
     */
    revelationList: Record<string, {progress: number, regress: number}>
    /**
     * book is data of player records
     */
    book: {
        /**
         * sectionList has a list of writed pages in current sections
         */
        sectionList: Record<string, IPlayerPage>
    }
}

abstract class Flags {

   private constructor() {};

   protected static list = {
        curses: [],
        playerData: {} as Record<string, playerData>
    };

   public static getFor(player: number): playerData {
       return Flags.list.playerData[Entity.getTypeName(player)];
   }

    static {

         Callback.addCallback("EntityAdded", (entity) => {

            if(Entity.getType(entity) === Native.EntityType.PLAYER) {

                Flags.list.playerData[Entity.getTypeName(entity)] ??= {
                    "book": {
                        "sectionList": {
                            "default": {"main": 0},
                            "cauldron": {},
                            "sign": {}
                        }
                    },
                    "learningList": new Set(),
                    "revelationList": {}
                }
                
            }
         })
    };
};


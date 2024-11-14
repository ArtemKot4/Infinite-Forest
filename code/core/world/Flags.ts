type pageBook = Record<string, number>;

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
        sectionList: Record<string, pageBook>
    }
}

abstract class Flags {

   private constructor() {};

   protected static list = {
        curses: [],
        playerData: {} as Record<string, playerData>
    };

   public static getFor(player: number): playerData {
       return Flags.list[player];
   }

    static {

         Callback.addCallback("EntityAdded", (entity) => {

            if(entity === EEntityType.PLAYER) {

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
                    
                Game.message(JSON.stringify(Flags.list.playerData[entity]));
                
            }
         })
    };
};


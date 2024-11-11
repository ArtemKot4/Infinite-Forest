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
        sectionList: Record<string, string[]>
    }
}

abstract class Flags {
   private constructor() {};

   protected static list = {
        curses: [],
        playerData: {} as Record<number, playerData>
    };

   public static getPlayerDataFor(player: number) {
        return this.list.playerData[player] ??= {
          learningList: new Set(),
          revelationList: {},
          book: {
            sectionList: {}
          }
        }
    }


   public static addLearning(side: Side, name: string, player?: number): void {
        if(side === Side.Client) {
            Network.sendToServer("packet.infinite_forest.addLearning", {name});
            return;
       };
         this.getPlayerDataFor(player).learningList.add(name);
   };

   public static updateRevelation(side: Side, name: string, data: [progress: number, regress?: number], player?: number) {
        if(side === Side.Client) {
            Network.sendToServer("packet.infinite_forest.updateRevelation", {name, progress: data[0], regress: data[1] || 0});
            return;
        };
         this.list.playerData[player].revelationList[name] = { progress: data[0], regress: data[1] || 0 };
   };

   public static getFlag(side: Side, name: string) {
       if(side === Side.Client) {
           delete Flags.list[name];

           Network.sendToServer("packet.infinite_forest.sendFlagSuccess", {name});

           while(Flags.list[name] == undefined) {
               java.lang.Thread.sleep(1);
           }

        };
           return Flags.list[name];
   };

    static {

        Network.addServerPacket("packet.infinite_forest.sendFlagSuccess", (client, data: {name: string}) => {
            client.send("packet.infinite_forest.acceptFlagSuccess", {name: data.name, value: Flags.list[data.name]})
        });

        Network.addClientPacket("packet.infinite_forest.acceptFlagSuccess", (data: {name: string, value: any}) => {
            Flags.list[data.name] = data.value;
        });

        Network.addClientPacket("packet.infinite_forest.addLearning", (data: {name: string}) => {
           const playerData = this.getPlayerDataFor(Player.getLocal());
        
           playerData.learningList.add(data.name);
        });

        Network.addClientPacket("packet.infinite_forest.updateRevelation", (data: {name: string, progress: number, regress: number}) => {
            const playerData = this.getPlayerDataFor(Player.getLocal());
         
            playerData.revelationList[data.name] = {
                progress: data.progress,
                regress: data.regress
            };

         });
    };
};


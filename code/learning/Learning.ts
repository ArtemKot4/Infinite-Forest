declare namespace LearningType {

    export type Item = (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) => boolean;
    export type CraftBuild = (stack: ItemStack[]) => boolean;

};

class Learning {
    public static list = {
        "item": {
            "click": {},
            "hand": {}
        },
        "learning": {
            "craft": {}
        }
    };

    public static add<T extends LearningBase<any>>(learning: T) {

        if(learning instanceof ItemLearning) {

            if(learning.type && learning.type === "hand") {
                
                Learning.list.item.hand[learning.getName()] = learning;
               
            } else {

                Learning.list.item.click[learning.getName()] = learning;

            };

        };

        if(learning instanceof CraftBuildLearning) {

               Learning.list.learning.craft[learning.getName()] = learning;

        }

    };

    public static has(player: number, name: string) {
        return Flags.getFor(player).learningList.has(name);
    };

    public static isValid(name: string) {
        
        return !!Learning.find(name);

    };

    public static find(name: string): LearningBase<any> {

        for(const i in Learning.list) {

            const find = Object.values(Learning.list[i]).find((v: {}) => name in v);

            if(!!find) {
                return find[name];
            };

        };

        return null;
    }
    
    public static addFor<T extends LearningBase<any>>(player: number, learning: string | T) {
        const list = Flags.getFor(player).learningList;

        const name = typeof learning === "string" ? learning : learning.getName();

        if(list.has(name)) return;

        if(typeof learning === "string") {

            if(!this.isValid(learning)) {
                throw new NoSuchFieldException("Learning.addFor error! Learning is not exists")
            };

              const instance = Learning.find(learning);

            if(instance) {
                if(instance.complete) instance.complete(player)
            };

        } else {
            if(learning.complete) learning.complete(player);
        };
      
        list.add(name);

    };

    static {

        Callback.addCallback("ItemUse", (coords, item, block, isExternal, player) => {
             for(const i in Learning.list.item) {

                   const learning = Learning.list.item[i];

                      if(item.id !== learning.getItem()) continue;

                   if(learning.condition && !learning.condition(coords, item, block, player)) continue;
                
                Learning.addFor(player, learning);
            };
        });

    };

};

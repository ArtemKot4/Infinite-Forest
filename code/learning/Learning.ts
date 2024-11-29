declare namespace LearningType {

    export type Item = (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) => boolean;
    export type CraftBuild = (stack: ItemStack[]) => boolean;

};

class Learning {
    public static list = {} as Record<string, Record<string, LearningBase<any>>>;

    public static add<T extends LearningBase<any>>(learning: T): void {

        const list = Learning.list[learning.getType()] ??= {};

        list[learning.getName()] ??= learning;

    };

    public static has(player: number, name: string): boolean {
        return Flags.getFor(player).learningList.has(name);
    };

    public static isValid(name: string): boolean {
        
        return !!Learning.find(name);

    };

    public static find(name: string): LearningBase<any> {

        for(const i in Learning.list) {

            const find = Object.values(Learning.list[i]).find((v) => name in v);

            if(!!find) {
                return find[name];
            };

        };

        return null;
    }
    
    public static addFor<T extends LearningBase<any>>(player: number, learning: string | T): void {
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

        return;
    };

};

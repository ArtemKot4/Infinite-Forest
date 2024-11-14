declare namespace LearningType {

    export type Item = (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) => boolean;

};

class LearningBase<T extends (...args: any[]) => boolean> {
    condition?: T;

    constructor(protected name: string) {}

    public setCondition(condition: T): this {
        this.condition = condition;
        return this;
    };

    public getName(): string {
        return this.name;
    }

};



class ItemLearning extends LearningBase<LearningType.Item> {
    constructor(name: string, protected item: number) {
        super(name);
    };

    public getItem(): number {
        return this.item;
    }
};

type learningList = {
   item: Record<string, ItemLearning>
};

class Learning {
    public static list: learningList = {
        "item": {}
    };

    public static add<T extends LearningBase<any>>(learning: T) {

        if(learning instanceof ItemLearning) {
            Learning.list.item[learning.getName()] = learning;
        };

    };

    public static has(player: number, name: string) {
        return Flags.getFor(player).learningList.has(name);
    };

    public static addFor<T extends string | LearningBase<any>>(player: number, learning: T) {
        const list = Flags.getFor(player).learningList;

        const name = typeof learning === "string" ? learning : learning.getName();

        if(list.has(name)) return;

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

}
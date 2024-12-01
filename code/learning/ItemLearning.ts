class ItemLearning extends LearningBase<LearningType.Item> {
    constructor(name: string, protected item: number) {
        super(name);
    };

    public getItem(): number {
        return this.item;
    };

    public getType(): string {
        return "item";
    };

    static {

        Callback.addCallback("ItemUse", (coords, item, block, isExternal, player) => {
             for(const i in Learning.list.item) {

                const learning = Learning.list.item[i] as ItemLearning;

                if(item.id !== learning.getItem()) continue;

                learning.complete(player, coords, item, block, player);
            };
        });

    };

};

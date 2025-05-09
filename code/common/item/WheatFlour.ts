class WheatFlour extends BasicItem implements IItemHoldCallback {
    public constructor() {
        super("wheat_flour", {
            name: "wheat_flour",
            meta: 0
        })
    }

    public onItemHold(item: ItemStack, player_uid: number): void {
        Learning.giveFor(player_uid, LearningList.FIRST_LUCKS.name);
    }

    public getName(): string {
        return "item.infinite_forest.wheat_flour";
    }
}
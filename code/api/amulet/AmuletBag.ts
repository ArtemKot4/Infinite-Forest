class AmuletBag {
    public static list: Record<int, AmuletUI> = {};
    public static readonly ITEM: FItem = new FItem("amulet_bag", 1);
    constructor() {
        Item.registerUseFunctionForID(AmuletBag.ITEM.getID(), this.onUse)
    };
    public onUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
        if(AmuletBag.list[player] === undefined) {
            AmuletBag.list[player] = new AmuletUI();
        };
        const list = AmuletBag.list[player];
        list.container.openAs(list.UI);
        Updatable.addUpdatable({
            update() {
                
            },
        })
    }
}
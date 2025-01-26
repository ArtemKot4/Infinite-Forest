class Log extends RotatableLog {
    constructor(id: string, public hewn_id: string) {
        super(id);
        this.create();
    };

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(ToolAPI.getToolData(item.id)?.blockMaterials?.["wood"]) {
            BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y, coords.z, BlockID[this.hewn_id], block.data);
        };
    };
};
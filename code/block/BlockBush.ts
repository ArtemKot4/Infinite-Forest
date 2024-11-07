abstract class BlockBush extends BlockPlant {

    public berryID: number;

    public getMaxStage() {
        return this.variationList.length - 1;
    };

    constructor(stringID: string, variationList: Block.BlockVariation[], berryID: number) {
        super(stringID, variationList);
        this.berryID = berryID;
    };

    abstract getChance(): number;

    abstract getCount(): [min: number, max: number];

    public onRandomTick(x: number, y: number, z: number, block: Tile, region: BlockSource): void {
        if(Math.random() > this.getChance()) return;

        if(block.data < this.getMaxStage()) {
            region.setBlock(x, y, z, block.id, block.data + 1);
        };
    };

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(block.data === this.getMaxStage()) {

            const count = this.getCount();

            BlockSource.getDefaultForActor(player).spawnDroppedItem(
                coords.x + 0.5,
                coords.y + 0.7,
                coords.z + 0.5,
                this.berryID,
                randomInt(count[0], count[1]),
                0
              );
        };
    }
}
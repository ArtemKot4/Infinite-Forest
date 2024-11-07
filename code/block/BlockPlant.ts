abstract class BlockPlant extends BlockForest {

    public static allowedBlockList: Set<number> = new Set<number>()
    .add(VanillaBlockID.dirt)
    .add(VanillaBlockID.grass)
    .add(VanillaBlockID.grass_path)
    .add(VanillaBlockID.podzol)
    .add(VanillaBlockID.mycelium);

    constructor(stringID: string, variationList: Block.BlockVariation[]) {
        super(stringID, variationList);
        ForestUtils.setEmptyBlockCollision(this.id);
    };

    public getCreativeGroup(): string {
        return "nature";
    };

    public onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
        if(!BlockPlant.allowedBlockList.has(region.getBlockId(coords.x, coords.y - 1, coords.z))) {
             region.destroyBlock(coords.x, coords.y, coords.z);
        }
    };

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        if(BlockPlant.allowedBlockList.has(region.getBlockId(coords.x, coords.y, coords.z)) &&
         region.getBlockId(coords.x, coords.y + 1, coords.z) === VanillaTileID.air) {
            region.setBlock(coords.x, coords.y + 1, coords.z, this.id, 0);
        }
    };

};


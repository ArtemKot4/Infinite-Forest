abstract class BlockPlant extends BlockForest {

    public static allowedBlockList: Set<number> = new Set<number>()
    .add(VanillaBlockID.dirt)
    .add(VanillaBlockID.grass)
    .add(VanillaBlockID.grass_path)
    .add(VanillaBlockID.podzol)
    .add(VanillaBlockID.mycelium);

    constructor(stringID: string, variationList: Block.BlockVariation[]) {
        super(stringID, variationList);
        Utils.setEmptyBlockCollision(this.id);
        
        if(this.getBiomeState) {
            this.onRandomTick = (x, y, z, block, region) => {
                const condition = Utils.getBiomeState(x, z, region) == this.getBiomeState();
                if(condition) {
                    region.destroyBlock(x, y, z, false);
                };
            };
        };
    };

    public getCreativeGroup(): string {
        return "nature";
    };

    public onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
        if(!BlockPlant.allowedBlockList.has(region.getBlockId(coords.x, coords.y - 1, coords.z))) {
            region.destroyBlock(coords.x, coords.y, coords.z);
        };
    };

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        const upperBlock = region.getBlockId(coords.x, coords.y + 1, coords.z);
        const isAllowedBlock = BlockPlant.allowedBlockList.has(region.getBlockId(coords.x, coords.y, coords.z));

        if(isAllowedBlock && upperBlock === VanillaTileID.air) {
            region.setBlock(coords.x, coords.y + 1, coords.z, this.id, 0);
        };
    };

    public getBiomeState?(): EBiomeState;

    public isSolid(): boolean {
        return false;
    };

    public getLightOpacity(): number {
        return 0;
    };

    public getDestroyTime(): number {
        return 0;
    };

    public getSoundType(): Block.Sound {
        return "grass";
    };

    public getRenderType(): number {
        return 1;
    };

};
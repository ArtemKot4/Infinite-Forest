type IMortarInput = {
    id: number,
    progress: number
};

class Mortar extends BasicBlock implements IBlockModel, INeighbourChangeCallback {
    public constructor() {
        super("mortar", [{
            texture: [["stone", 0]],
            name: "block.infinite_forest.mortar",
            inCreative: true
        }]);

        Block.setShape(this.id, 0, 0, 0, 1, 2 / 16, 1);
    }

    public onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void {
        if(region.getBlockID(coords.x, coords.y - 1, coords.z) == 0) {
            region.destroyBlock(coords.x, coords.y, coords.z, true);
        }
    }

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/mortar", "mortar");
    }

    public override getTileEntity(): CommonTileEntity {
        return new MortarTile();
    }
}
type IMortarInput = {
    id: number,
    progress: number
};

class Mortar extends BasicBlock implements IBlockModel {
    public static factory: Factory = new Factory();

    public constructor() {
        super("mortar", [{
            texture: [["stone", 0]],
            name: "block.infinite_forest.mortar",
            inCreative: true
        }]);

        Block.setShape(this.id, 0, 0, 0, 1, 2/16, 1);
    }

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/mortar", "mortar");
    }

    public override getTileEntity(): CommonTileEntity {
        return new MortarTile();
    }
}
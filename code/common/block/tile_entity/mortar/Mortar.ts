type IMortarInput = {
    id: number,
    progress: number
};

class Mortar extends BasicBlock implements IBlockModel {
    public static recipes: Record<number, IMortarInput> = {};
    public static addRecipe(id: number, recipe: IMortarInput) {
        Mortar.recipes[id] = recipe;
    }

    public constructor() {
        super("mortar", [{
            texture: [["stone", 0]],
            name: "block.infinite_forest.mortar",
            inCreative: true
        }]);

        Block.setShape(this.id, 0, 0, 0, 1, 3/16, 1);
    }

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/mortar", "mortar");
    }

    public override getTileEntity(): CommonTileEntity {
        return new MortarTile();
    }
}
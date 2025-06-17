class LearningTable extends BasicBlock implements IBlockModel {
    public constructor() {
        super("learning_table", [{
            name: "block.infinite_forest.learning_table",
            texture: [["eucalyptus_log_side", 0]],
            inCreative: true
        }]);
    }

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/learning_table", "learning_table");
    }

    public override getSoundType(): Block.Sound {
        return "wood";
    }

    public override getTileEntity(): CommonTileEntity {
        return new LearningTableTile();
    }
}
class EucalyptusTorchUnlit extends BasicBlock implements IBlockModel {
    public constructor() {
        super("eucalyptus_torch_unlit", [{
            name: "block.infinite_forest.eucalyptus_torch",
            texture: [["eucalyptus_torch", 0]],
            inCreative: true
        }]);
    }

    public override getMaterial(): string {
        return "wood";
    }

    public override getSoundType(): Block.Sound {
        return "wood";
    }

    public getModel(): BlockModel | BlockModel[] {
        return new BlockModel(modelsdir, "block/eucalyptus_torch", "eucalyptus_torch");
    }

    public override getTileEntity(): CommonTileEntity {
        return new EucalyptusTorchTile();
    }
}
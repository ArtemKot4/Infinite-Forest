class LearningTable extends BasicBlock implements IPlaceCallback {
    public static GROUP = ICRender.getGroup("if.learning_table");
    public constructor() {
        super("learning_table", [{
            name: "block.infinite_forest.learning_table",
            texture: [["eucalyptus_log_side", 0]],
            inCreative: false
        }]);
        Item.addToCreative(this.id, 64, 1);
        this.setConcatinationModel();
    }

    public override getSoundType(): Block.Sound {
        return "wood";
    }

    public override getTileEntity(): CommonTileEntity {
        return new LearningTableTile();
    }

    public getLegWidth(): number {
        return 0.3;
    }

    public setConcatinationModel(): void {
        LearningTable.GROUP.add(this.id, 0);

        const legWidth = this.getLegWidth();
        const concatingRender = new ICRender.Model();
        const top = new BlockRenderer.Model();
        const legHeight = 1 - 0.4;

        top.addBox(0, 1 - 0.4, 0, 1, 1, 1, [
            ["learning_table_top", 0], ["learning_table_top", 0], ["learning_table_side", 0], ["learning_table_side", 0], ["learning_table_side", 0], ["learning_table_side", 0]
        ]);
        concatingRender.addEntry(top);

        const firstLeftLeg = new BlockRenderer.Model();
        firstLeftLeg.addBox(1 / 16, 0, 1 / 16, legWidth, legHeight, legWidth, this.id, -1);

        const secondLeftLeg = new BlockRenderer.Model();
        secondLeftLeg.addBox(15 / 16 - legWidth, 0, 15 / 16 - legWidth, 15 / 16, legHeight, 15 / 16, this.id, -1);

        const firstRightLeg = new BlockRenderer.Model();
        firstRightLeg.addBox(1 / 16, 0, 15 / 16 - legWidth, 1 / 16 + legWidth, legHeight, 15 / 16, this.id, -1);

        const secondRightLeg = new BlockRenderer.Model();
        secondRightLeg.addBox(15 / 16 - legWidth, 0, 1 / 16, 15 / 16, legHeight, 1 / 16 + legWidth, this.id, -1);

        concatingRender.addEntry(firstLeftLeg).setCondition(ICRender.AND(
            ICRender.BLOCK(-1, 0, 0, LearningTable.GROUP, true),
            ICRender.BLOCK(0, 0, -1, LearningTable.GROUP, true))
        );

        concatingRender.addEntry(secondLeftLeg).setCondition(ICRender.AND(
            ICRender.BLOCK(1, 0, 0, LearningTable.GROUP, true), 
            ICRender.BLOCK(0, 0, -1, LearningTable.GROUP, true))
        );

        concatingRender.addEntry(firstRightLeg).setCondition(ICRender.AND(
            ICRender.BLOCK(1, 0, 0, LearningTable.GROUP, true), 
            ICRender.BLOCK(0, 0, 1, LearningTable.GROUP, true))
        );

        concatingRender.addEntry(secondRightLeg).setCondition(ICRender.AND(
            ICRender.BLOCK(-1, 0, 0, LearningTable.GROUP, true), 
            ICRender.BLOCK(0, 0, 1, LearningTable.GROUP, true))
        );

        BlockRenderer.setStaticICRender(this.id, 0, concatingRender);

        const commonRender = new ICRender.Model();
        commonRender.addEntry(top);
        commonRender.addEntry(firstLeftLeg);
        commonRender.addEntry(secondLeftLeg);
        commonRender.addEntry(firstRightLeg);
        commonRender.addEntry(secondRightLeg);
        BlockRenderer.setStaticICRender(this.id, 1, commonRender);
    }

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        return region.setBlock(coords.x, coords.y + 1, coords.z, this.id, Entity.getSneaking(player) == true ? 1 : 0);
    }
}
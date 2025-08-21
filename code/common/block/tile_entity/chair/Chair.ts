class Chair extends BasicBlock implements IClickCallback {
    public constructor() {
        super("forest_chair", [
            {
                name: "block.infinite_forest.chair",
                texture: [["eucalyptus_log_side", 0]],
                inCreative: true
            }
        ]);

        const legTexture: BlockRenderer.ModelTextureSet = [
            ["learning_table_leg_top", 0],
            ["learning_table_leg_top", 0],
            ["learning_table_leg_side", 0],
            ["learning_table_leg_side", 0],
            ["learning_table_leg_side", 0],
            ["learning_table_leg_side", 0],
        ];

        const render = new ICRender.Model();
        const model = new BlockRenderer.Model();
        const legWidth = 4 / 16;
        const legHeight = 7 / 16;

        model.addBox(3 / 16, legHeight, 3 / 16, 13 / 16, 11 / 16, 13 / 16, [
            ["learning_table_top", 0], 
            ["learning_table_top", 0], 
            ["learning_table_side", 0], 
            ["learning_table_side", 0], 
            ["learning_table_side", 0], 
            ["learning_table_side", 0]
        ]);
        model.addBox(5 / 16, 0, 5 / 16, 11 / 16 - legWidth, legHeight, 11 / 16 - legWidth, legTexture);
        model.addBox(11 / 16 - legWidth, 0, 11 / 16 - legWidth, 11 / 16, legHeight, 11 / 16, legTexture);
        model.addBox(5 / 16, 0, 11 / 16 - legWidth, 5 / 16 + legWidth, legHeight, 11 / 16, legTexture);
        model.addBox(11 / 16 - legWidth, 0, 5 / 16, 11 / 16, legHeight, 5 / 16 + legWidth, legTexture);
        render.addEntry(model);
        BlockRenderer.setStaticICRender(this.id, -1, render);
    }

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number): void {
        Entity.setPosition(playerUid, coords.x + 0.5, coords.y + 0.9, coords.z + 0.5);
    }
}
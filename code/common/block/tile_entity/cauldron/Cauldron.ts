class Cauldron extends BasicBlock {
    public factory = new Factory<number[]>();

    public constructor() {
        super("iron_cauldron", [{
            name: "block.infinite_forest.iron_cauldron",
            texture: [["iron_cauldron", 0]],
            inCreative: true
        }]);
    };

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/iron_cauldron", "iron_cauldron");
    };

    public override getTileEntity(): CommonTileEntity {
        return new CauldronTile();
    };
};

Translation.addTranslation("message.infinite_forest.is_not_valid_item", {
    en: "This is not a valid item",
    ru: "Это не подходящий предмет"
});

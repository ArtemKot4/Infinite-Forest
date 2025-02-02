class ItemList {
    public static readonly ORANGE_CRYSTAL = new OrangeCrystal();
    public static readonly BLUE_CRYSTAL = new BlueCrystal();
    public static WHEAT_FLOUR = new ItemForest("wheat_flour", {
        name: "wheat_flour",
        meta: 0
    });
    public static ANCIENT_NOTE = new AncientNote();
};

Translation.addTranslation("item.infinite_forest.wheat_flour", {
    en: "Wheat flour",
    ru: "Пшеничная мука"
});

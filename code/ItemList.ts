class ItemList {
    public static readonly ORANGE_CRYSTAL: ItemForest = new OrangeCrystal();
    public static readonly BLUE_CRYSTAL: ItemForest = new BlueCrystal();
    public static WHEAT_FLOUR: ItemForest = new ItemForest("wheat_flour", {
        name: "wheat_flour",
        meta: 0
    });
};

Translation.addTranslation("item.infinite_forest.wheat_flour", {
    en: "Wheat flour",
    ru: "Пшеничная мука"
});

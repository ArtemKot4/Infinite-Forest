class ItemList {
    public static readonly ORANGE_CRYSTAL = new OrangeCrystal();
    public static readonly BLUE_CRYSTAL = new BlueCrystal();
    public static WHEAT_FLOUR = new class extends ItemForest implements ItemHandComponent {
        public onHand(item: ItemStack, player_uid: number): void {
            return ObjectPlayer.addLearning(player_uid, "first_lucks");
        }
    }("wheat_flour", {
        name: "wheat_flour",
        meta: 0
    })
    //new ItemForest();
    public static ANCIENT_NOTE = new AncientNote();
};

Translation.addTranslation("item.infinite_forest.wheat_flour", {
    en: "Wheat flour",
    ru: "Пшеничная мука"
});

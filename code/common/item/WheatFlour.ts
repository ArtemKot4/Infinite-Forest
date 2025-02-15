class WheatFlour extends ItemForest implements ItemHandComponent {
    public constructor() {
        super("wheat_flour", {
            name: "wheat_flour",
            meta: 0
        })
    };

    public onHand(item: ItemStack, player_uid: number): void {
        Learning.giveFor(player_uid, LearningList.FIRST_LUCKS.name);
    };
};

Translation.addTranslation("item.infinite_forest.wheat_flour", {
    en: "Wheat flour",
    ru: "Пшеничная мука"
});

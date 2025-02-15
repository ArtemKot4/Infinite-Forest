class CandleTile extends TileEntityBase {

};

class Candle extends BlockForest {
    public constructor() {
        super("candle", [{
            name: "block.infinite_forest.candle",
            texture: [["candle", 0]],
            inCreative: true
        }]);
    };

    public getTags(): string[] {
        return ["candle"];
    };
};

Translation.addTranslation("block.infinite_forest.candle", {
    en: "Candle",
    ru: "Cвеча"
});
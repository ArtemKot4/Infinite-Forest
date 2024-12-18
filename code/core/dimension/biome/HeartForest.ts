class HeartForest extends AbstractBiome {
    public constructor() {
        super("heart_forest");
    };

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    };

    public override getPlantList() {
        return {
            wither_rose: {rarity: 0.3}
        };
    };
}
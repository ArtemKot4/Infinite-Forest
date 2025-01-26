class HeartForest extends AbstractBiome {
    public constructor() {
        super("heart_forest");
    };

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    };

    public override getGrassColor(): RGB {
        return {r: 79, g: 79, b: 79};
    };

    public override getPlantList() {
        return {
            wither_rose: {rarity: 0.3}
        };
    };
}
class HeartForest extends BiomeBase {
    public constructor() {
        super("heart_forest");
    };

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    };

    public override getPlantList(): Record<string, number> {
        return {"wither_rose": 0.3};
    };
}
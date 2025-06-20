class HeartForest extends AbstractForestBiome {
    public override sign = "map.heart";
    
    public constructor() {
        super("heart_forest");
    }

    public override getMapColor(): number[] {
        return [105, 105, 105];
    }

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    }

    public override getGrassColor(): number[] {
        return [79, 79, 79];
    }

    public override getPlantList() {
        return {
            wither_rose: {
                rarity: 0.3
            }
        };
    }
}
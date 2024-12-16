class FirefliesForest extends AbstractBiome {
  public constructor() {
    super("fireflies_forest");
  }

  public override getBiomeState(): EBiomeState {
    return EBiomeState.BALANCE;
  }

  public override getPlantList(): Record<string, number> {
    return {
      fironia: 0.1,
      ice_flower: 0.1,
    };
  }
}

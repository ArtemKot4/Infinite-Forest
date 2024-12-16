class WinterForest extends AbstractBiome {
  public constructor() {
    super("winter_forest");
  }

  public override getBiomeState(): EBiomeState {
    return EBiomeState.COLD;
  }

  public override getPlantList(): Record<string, number> {
    return null;
  };

  public override getRuntimeSkyColor(): RGB {
      return {r: 255, g: 255, b: 255};
  };

  public override getRuntimeFogColor(): RGB {
      return {r: 255, g: 255, b: 255};
  };
  
}

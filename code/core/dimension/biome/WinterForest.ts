class WinterForest extends BiomeForest {
  public constructor() {
    super("winter_forest");
  }

  public override getBiomeState(): EBiomeState {
    return EBiomeState.COLD;
  }

  public override getPlantList(): Record<string, number> {
    return null;
  };

  public getRuntimeSkyColor(): RGB {
      return new RGB(255, 255, 255);
  };

  public getRuntimeFogColor(): RGB {
      return new RGB(255, 255, 255);
  };
  
}

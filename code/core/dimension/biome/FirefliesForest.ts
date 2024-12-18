class FirefliesForest extends AbstractBiome {
  public constructor() {
    super("fireflies_forest");
  }

  public override getBiomeState(): EBiomeState {
    return EBiomeState.BALANCE;
  }

  public override getPlantList() {
    return {
      tallgrass: {rarity: 0.99, count: 32},
      double_plant: {rarity: 0.4, count: 3},
      //tallgrass: {rarity: 0.8, data: 2, count: 8},
      yellow_flower: {rarity: 0.2, count: 5}, 
      red_flower: {rarity: 0.5, count: 4},
      fironia: {rarity: 0.1, count: 3},
      ice_flower: {rarity: 0.1, count: 3},
    };
  }
}

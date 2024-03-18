
const InfiniteForest = new Dimensions.CustomDimension("infinite_forest", 75);
const InfiniteForestBiome = new CustomBiome("infinite_forest")
InfiniteForest.setHasSkyLight(false);
InfiniteForest.setSkyColor(21 / 255, 96 / 255, 189 / 255);
InfiniteForest.setFogColor(0 / 255, 128 / 255, 0 / 255);
const generator = Dimensions.newGenerator({
  biome: InfiniteForestBiome.id,
  layers: [
    {
      minY: 2,
      maxY: 75,
      yConversion: [[0, 0]],
      material: { base: 9 },
    },
    {
      minY: 0,
      maxY: 82,
      yConversion: [
        [0.7, 1],
        [1, -0.5],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 4, scale: 20 },
      },
    },
    {
      minY: 2,
      maxY: 4,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ],
});
InfiniteForest.setGenerator(generator);

class Forest {
  public static setupPlant (obj: {coords: Vector, place: Vector, id: number, random: [number, number]}) {
    const {coords, place, id, random} = obj
    for (let i = 0; i < randomInt(random[0], random[1]); i++) {
      if (BlockSource.getDefaultForActor(Player.getLocal()).getBlockId(coords.x, coords.y+1, coords.z) == 0) {
        World.setBlock(place.x, place.y + 1, place.z, id, 0);
      }
    }
  }
}
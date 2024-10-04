const InfiniteForest = new Dimensions.CustomDimension("infinite_forest", 75);
InfiniteForest.setSkyColor(21 / 255, 96 / 255, 189 / 255);
InfiniteForest.setFogColor(0 / 255, 128 / 255, 0 / 255);
InfiniteForest.setHasSkyLight(false);

namespace ForestGeneration {

  abstract class DimensionLayers {

    private constructor() {}
    public static list: Dimensions.TerrainLayerParams[] = [];

    public static add(layer: Dimensions.TerrainLayerParams) {
      DimensionLayers.list.push(layer);
    }
  }

  DimensionLayers.add( {
    minY: 0,
    maxY: 55,
    yConversion: [
      [0, 1],
      [-1, 0.4],
    ],
    material: { base: 9 },
  }); //FOREST SURFACE WATER

  DimensionLayers.add( {
      minY: 0,
      maxY: 120,
      yConversion: [
        [0, 1.7],
        [1, -1.9],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 5, scale: 70 },
      },
    }); //FOREST SURFACE

  const generator = Dimensions.newGenerator({
    biome: ForestBiomes.FirefliesForest.id, // ForestBiomes.FirefliesForest.getID(),

    layers: DimensionLayers.list.concat({
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    }),
  });

  InfiniteForest.setGenerator(generator);
}

interface IPlantDesc {
  coords: Vector;
  place: Vector;
  id: number;
  random: [number, number];
}

/*
[
    {
      minY: 0,
      maxY: 55,
      yConversion: [
        [0, 1],
        [-1, 0.4],
      ],
      material: { base: 9 },
    },

    {
      minY: 0,
      maxY: 120,
      yConversion: [
        [0, 1.7],
        [1, -1.9],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 5, scale: 70 },
      },
    },

    {
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ],
*/

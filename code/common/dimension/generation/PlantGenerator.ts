class PlantGenerator {
    private constructor() {}

    public static place(coords: Vector, id: number, data?: number) {
        if (World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass && World.getBlockID(coords.x, coords.y + 1, coords.z) === 0) {
            return World.setBlock(coords.x, coords.y + 1, coords.z, id, data || 0);
        };
    };

    public static init(chunkX: number, chunkZ: number) {
        let randomCoords = GenerationUtils.randomCoords(chunkX, chunkZ);
        let coords = GenerationUtils.findSurface(randomCoords.x, 90, randomCoords.z);

        const biome = AbstractForestBiome.getFor(World.getBiome(coords.x, coords.z));

        if (!biome) {
            throw new NoSuchFieldException("Unregistered biome!");
        }

        const plantList = biome.getPlantList();

        if (!plantList) return;

        for (const i in plantList) {
            const plant = plantList[i];

            let split = i.split(":");

            const id = IDRegistry.parseBlockID(split[0]);
            const data = plant.data || (split[1] ? Number(split[1]) : 0);

            for (let count = 0; count < (plant.count || 5); count++) {
                if (Math.random() > plant.rarity) continue;

                randomCoords = GenerationUtils.randomCoords(chunkX, chunkZ);
                coords = GenerationUtils.findSurface(randomCoords.x, 90, randomCoords.z);

                if (coords.y < 54) continue;

                if (plant.tile && !!plant.tile) {
                    TileEntity.destroyTileEntityAtCoords(coords.x, coords.y, coords.z);
                    TileEntity.addTileEntity(coords.x, coords.y, coords.z, BlockSource.getCurrentWorldGenRegion());
                };

                this.place(coords, id, data);
            };
        };
        return;
    };
};

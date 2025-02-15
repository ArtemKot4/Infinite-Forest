class InfiniteForest {
    public static id: number = 75;
    public static stringID: string = "infinite_forest";

    public static dimension: Dimensions.CustomDimension = new Dimensions.CustomDimension(this.stringID, this.id);

    public static layerList: Dimensions.TerrainLayerParams[] = [];

    public static addLayer(layer: Dimensions.TerrainLayerParams): void {
        this.layerList.push(layer);
        this.dimension.setGenerator(this.getGenerator());
    };

    public static getGenerator(): Dimensions.CustomGenerator {
        return Dimensions.newGenerator({
            biome: BiomeList.FIREFLIES_FOREST.id,

            layers: this.layerList.concat({
                minY: 0,
                maxY: 1,
                yConversion: [[0.7, 1]],
                material: { base: VanillaBlockID.bedrock },
            })
        });
    };

    static {
        let skyColor = [21 / 255, 96 / 255, 189 / 255], fogColor = [0, 128 / 255, 0];

        if(ConfigManager.LEGACY_SKY_COLOR) {
            skyColor = [.05,.2, .3], fogColor = [0, .6, .3];
        };

        this.dimension.setSkyColor(skyColor[0], skyColor[1], skyColor[2]);
        this.dimension.setFogColor(fogColor[0], fogColor[1], fogColor[2]);
        this.dimension.setHasSkyLight(false);

        this.addLayer({
            minY: 0,
            maxY: 55,
            yConversion: [
                [0, 1],
                [-1, 0.4],
            ],
            material: { base: VanillaBlockID.water },
        });

        this.addLayer({
            minY: 0,
            maxY: 120,
            yConversion: [
                [0, 1.7],
                [1, -1.9],
            ],
            material: {
                base: VanillaBlockID.stone,
                surface: { id: VanillaBlockID.dirt, data: 0, width: 3 },
                cover: VanillaBlockID.grass,
            },
            noise: {
                octaves: { count: 5, scale: 70 },
            },
        });

        TagRegistry.addCommonObject("dimensions", this.id, ["nature", "magic", "forest"]);
    };
};

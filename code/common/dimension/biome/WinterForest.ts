class WinterForest extends AbstractForestBiome implements BiomeBehaviour {
    public override sign = "map.fireflies_forest";//"map.winter_forest"; 

    public constructor() {
        super("winter_forest");
    }

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    }

    public override getPlantList() {
        return {
            "tallgrass:2": {
                rarity: 0.4,
                count: 32
            },
            "tallgrass": { 
                rarity: 0.99,
                count: 32
            },
            "ice_flower": { 
                rarity: 0.1, 
                count: 3 
            }
        };
    }

    public override getMapColor(): number[] {
        return [91, 161, 206];
    }

    public getBiomeMapCondition(perlin: number): boolean {
        return perlin > (0.7 - 12 / 128);
    }

    public override getRuntimeSkyColor(): number[] {
        return [255, 255, 255]
    }

    public override getRuntimeFogColor(): number[] {
        return [255, 255, 255]
    }

    public override getGrassColor(): number[] {
        return [255, 255, 255]
    }

    public override getStructures(): { name: string; chance: number; count: number; }[] {
        return [
            {
                name: "winter_tree",
                chance: 0.94,
                count: 3
            }
        ];
    }

    public runSnowInRadius(x: number, y: number, z: number, radius = 16, count = 16) {
        if (World.getThreadTime() % 8 === 0) {
            for (let n = -count; n <= count; n++) {
                Particles.addParticle(EForestParticle.SNOWFALL, x + n, y, z + MathHelper.randomInt(-radius, radius), 0.05, -0.1, 0);

                Particles.addParticle(EForestParticle.SNOWFALL, x + MathHelper.randomInt(-radius, radius), y, z + n, 0.05, -0.1, 0);
            }
        }
    }

    public insideLocalTick(): void {
        if (!Curse.has("cold")) {
            return;
        }

        const pos = Player.getPosition();
        this.runSnowInRadius(pos.x, pos.y + 12.5, pos.z, 64, 24);
    }

    public getLocalUpdate(): number {
        return 20;
    }

    public insideServerTick(player: number, region: BlockSource, x: number, y: number, z: number, time: number): void {
        if(Curse.has("cold")) {
            Effect.get("winter").init(player, 80, 7);
        }
    }

    getServerUpdate(): number {
        return 60;
    }
}


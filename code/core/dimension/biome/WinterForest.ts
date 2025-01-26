class WinterForest extends AbstractBiome implements BiomeBehaviour {
    public constructor() {
        super("winter_forest");
    }

    public override getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    }

    public override getPlantList() {
        return null;
    }

    public override getRuntimeSkyColor(): RGB {
        return { r: 255, g: 255, b: 255 };
    }

    public override getRuntimeFogColor(): RGB {
        return { r: 255, g: 255, b: 255 };
    }

    public runSnowInRadius(x: number, y: number, z: number, radius = 16, count = 16) {
        if (World.getThreadTime() % 8 === 0) {
            for (let n = -count; n <= count; n++) {
                Particles.addParticle(EForestParticle.SNOWFALL, x + n, y, z + randomInt(-radius, radius), 0.05, -0.1, 0);

                Particles.addParticle(EForestParticle.SNOWFALL, x + randomInt(-radius, radius), y, z + n, 0.05, -0.1, 0);
            }
        }
    }

    public onLocalTick(): void {
        if (!Curse.has("cold")) {
            return;
        };

        const pos = Player.getPosition();
        this.runSnowInRadius(pos.x, pos.y + 12.5, pos.z, 64, 24);
    }

    public getLocalUpdate(): number {
        return 20;
    }
}

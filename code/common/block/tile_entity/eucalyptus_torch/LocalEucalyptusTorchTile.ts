class LocalEucalyptusTorchTile extends LocalTileEntity {
    public override onTick(): void {
        const enabled = this.networkData.getBoolean("enabled", true);
        if(!enabled) return;

        const height = this.networkData.getFloat("height", 2);
        const rainSpeed = this.networkData.getFloat("speed", 0.2);
        const rainDensity = this.networkData.getInt("rain_density", 1);

        const rainHeight = height + 0.1;
        const cloudsHeight = height + 0.5;

        for(let i = 0; i < rainDensity; i++) {
            Particles.addParticle(
                EForestParticle.GREEN_RAIN, 
                this.x - 0.5 + MathHelper.randomInt(0.3, 0.6),
                this.y + rainHeight,
                this.z - 0.5 + MathHelper.randomInt(0.3, 0.5),
                0.01,
                -rainSpeed,
                0.01
            );
        };

        for(let i = 0; i <= 6; i++) {
            Particles.addParticle(
                EForestParticle.CLOUD,
                this.x - 0.5 + MathHelper.randomInt(0.3, 0.6),
                this.y + cloudsHeight,
                this.z - 0.5 + MathHelper.randomInt(0.3, 0.6),
                0,
                0,
                0
            );
        };
    };
};
class LocalFirefliesBottleTile extends LocalTileEntity {
    public override onTick(): void {
        if(World.getThreadTime() % 10 === 0) {
            const color = this.networkData.getInt("color", EForestParticle.GLOWWORM_2);

            Particles.addParticle(
                color,
                this.x + 0.5,
                this.y + 0.45,
                this.z + 0.5,
                0.001,
                0.001,
                0.001
            );
        };
    };
};
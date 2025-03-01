class LocalCandleTile extends LocalTileEntity {
    public static vectors = [
        [0.5, 0.75, 0.5],
        [0.8, 0.6, 0.5],
        [0.2, 0.6, 0.5],
        [0.5, 0.6, 0.8],
        [0.5, 0.6, 0.2]
    ];

    public override onTick(): void {
        const flames = this.networkData.getInt("flames", 0);

        if(flames <= 0) return;

        for(let i = 0; i < flames; i++) {
            Particles.addParticle(EParticleType.FLAME,
                this.x + LocalCandleTile.vectors[i][0] + Math.random() / 20,
                this.y + LocalCandleTile.vectors[i][1] + Math.random() / 20,
                this.z + LocalCandleTile.vectors[i][2] + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };
    };
}
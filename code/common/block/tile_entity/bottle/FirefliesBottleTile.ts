class FirefliesBottleTile extends CommonTileEntity {
    public defaultValues = {
        color: null
    };

    public data: typeof this.defaultValues;

    public override onLoad(): void {
        this.data.color ??= ParticleHelper.getRandomGlowworm();
        this.networkData.putInt("color", this.data.color);
        this.networkData.sendChanges();
    };

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalFirefliesBottleTile();
    };
};
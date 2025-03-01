class LocalWindmillBladesTile extends LocalTileEntity {
    public static render_side: RenderSide<string> = new RenderSide(modelsdir, "block/mill_blades");
    public animation!: BlockAnimation;

    @NetworkEvent
    public break_particle(): void {
        for(let i = 0; i < 3; i++) {
            Particles.addParticle(EParticleType.CLOUD, this.x + 0.5, this.y + 0.5, this.z + 0.5, 0, 0.02, 0);
        };
        return;
    };
    
    public override onLoad(): void {
        this.animation = new BlockAnimation(
            new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
            this
        );

        this.animation.describe(LocalWindmillBladesTile.render_side, "mill/mill_blades", 4);
        this.animation.load();
        return;
    };

    public override onUnload(): void {
        this.animation && this.animation.destroy();
    };

    public override onTick(): void {
        if(World.getThreadTime() % 60 === 0) {
            const height = this.networkData.getInt("height", 0);

            if(height < 10) {
                return;
            };
        };
        
        const speed = this.networkData.getFloat("speed", 0.2);

        const blockSource = BlockSource.getCurrentClientRegion();
        const data = blockSource.getBlockData(this.x, this.y, this.z);

        const move_coords = {
            x: speed,
            z: 0
        };

        if(data === 0 || data === 1) {
            move_coords.z = move_coords.x;
            move_coords.x = 0;
        };

        this.animation.rotate(move_coords.x, 0, move_coords.z);
    };
};
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

class WindmillBladesTile extends CommonTileEntity {
    public defaultValues = {
        enabled: false, //false
        speed: 0.05
    };

    public data: typeof this.defaultValues;

    public initDestroy() {
        this.blockSource.destroyBlock(this.x, this.y, this.z, true);
        this.selfDestroy();
        return;
    };

    public override onLoad(): void {
        const stationTile = this.getStationTile();
        const height = this.findHeight();

        if(!stationTile || height < 10) {
            this.sendPacket("break_particle", {});
            this.initDestroy();
            return;
        };

        if(Utils.getBiomeState(this.x, this.z, this.blockSource) === EBiomeState.COLD) {
            this.networkData.putFloat("speed", 0.005);
        } else {
            this.data.enabled = true;
        };

        this.networkData.putBoolean("enabled", this.data.enabled);
        this.networkData.sendChanges();
    };

    public override onTick(): void {
        if(World.getThreadTime() % 60 === 0) {
            const height = this.findHeight();
            const currentWeather = World.getWeather();

            this.networkData.putBoolean("enabled", this.data.enabled);
            this.networkData.putFloat("speed", currentWeather.rain > 0 ? this.data.speed * 2 : this.data.speed);
            this.networkData.putInt("height", height);
            
            const stationTile = this.getStationTile();

            if(stationTile !== null) {
                stationTile.data.height = height;
            };

            this.switchStationMode(this.data.enabled);

            this.networkData.sendChanges();
            return;
        };
    };

    public override onDestroyTile(): boolean {
        this.switchStationMode(false);
        return false;
    };

    public switchStationMode(value: boolean): void {
        const stationTile = this.getStationTile();

        if(stationTile != null) {
            stationTile.data.enabled = value;
            stationTile.networkData.putBoolean("enabled", value);
            stationTile.networkData.sendChanges()
        };                 
        return;                        
    };

    public getStationTile(): Nullable<WindmillStationTile & TileEntity> {
        const vectors = [
            [this.x, this.z + 1],
            [this.x, this.z - 1],
            [this.x + 1, this.z],
            [this.x - 1, this.z] 
        ];

        for(const i in vectors) {
            const id = this.blockSource.getBlockID(vectors[i][0], this.y, vectors[i][1]);

            if(id === BlockList.WINDMILL_STATION.id) {
                return TileEntity.getTileEntity(vectors[i][0], this.y, vectors[i][1], this.blockSource) as WindmillStationTile & TileEntity;
            };
        };

        return null;
    };

    public findHeight(): number {
        let height = 1;

        while(this.blockSource.getBlockID(this.x, this.y-height, this.z) === 0) {
            height++;
        };

        return height;
    };
};

class WindmillBlades extends BasicBlock {
    public constructor() {
        super("windmill_blades", [{
            name: "block.infinite_forest.windmill_blades",
            texture: [
                ["unknown", 0], 
                ["unknown", 0], 
                ["unknown", 0], 
                ["unknown", 0], 
                ["unknown", 0], 
                ["unknown", 0]
            ],
            inCreative: true
        }]);

        Utils.setEmptyBlockCollision(this.id);
    };

    public getTileEntity(): CommonTileEntity {
        return new WindmillBladesTile();
    };

    public canRotate(): boolean {
        return true;
    };
};


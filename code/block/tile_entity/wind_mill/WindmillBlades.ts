class WindmillBladesTile extends TileEntityBase {
    public static render_side: RenderSide<string> = new RenderSide("block/mill_blades");

    public defaultValues = {
        enabled: false, //false
        speed: 0.05
    };

    public data: typeof this.defaultValues;

    public animation!: BlockAnimation;
    
    public override clientLoad(): void {
        this.animation = new BlockAnimation(
            new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
            this
        );

        this.animation.describe(WindmillBladesTile.render_side, "mill/mill_blades", 4);
        this.animation.load();
        return;
    };

    public override onLoad(): void {
        const tile = this.getStationTile();
        const height = this.findHeight();

        if(!tile || height < 10) {
            this.blockSource.destroyBlock(this.x, this.y, this.z, true);
            this.selfDestroy();
            return;
        };

        this.data.enabled = true;

        this.networkData.putBoolean("enabled", this.data.enabled);
        this.networkData.sendChanges();
    }

    public override clientUnload(): void {
        this.animation && this.animation.destroy();
    };

    public override clientTick(): void {
        const enabled = this.networkData.getBoolean("enabled", false);
        const speed = this.networkData.getFloat("speed", 0.2);

        if(!enabled) {
            return;
        };

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

    public override onTick(): void {
        if(World.getThreadTime() % 60 === 0) {
            const currentWeather = World.getWeather();

            this.networkData.putBoolean("enabled", this.data.enabled);
            this.networkData.putFloat("speed", currentWeather.rain > 0 ? this.data.speed * 2 : this.data.speed);

            this.switchStationMode(true);

            this.networkData.sendChanges();
            return;
        };
    };

    public override destroy(): boolean {
        this.switchStationMode(false);
        return false;
    };

    public switchStationMode(value: boolean): void {
        const stationTile = this.getStationTile();

        if(stationTile != null) {
            stationTile.data.enabled = value;
        };                                         
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

            if(id === BlockList.WINDMILL_STATION.getID()) {
                return TileEntity.getTileEntity(vectors[i][0], this.y, vectors[i][1], this.blockSource) as WindmillStationTile & TileEntity;;
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

class WindmillBlades extends BlockForest {
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

    public getTileEntity(): TileEntityBase {
        return new WindmillBladesTile();
    };

    public canRotate(): boolean {
        return true;
    };
};


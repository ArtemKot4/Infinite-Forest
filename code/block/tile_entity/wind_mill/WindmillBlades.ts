class WindmillBladesTile extends TileEntityBase {
    public static render_side: RenderSide<string> = new RenderSide("block/mill_blades");

    public defaultValues = {
        enable: true, //false
        speed: 20
    };

    public data: typeof this.defaultValues;

    public animation!: BlockAnimation;
    
    public override clientLoad(): void {
        this.animation = new BlockAnimation(
            new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
            this
        );

        this.animation.describe(WindmillBladesTile.render_side, "mill/mill_blades", 5);
        this.animation.load();
        return;
    };

    public override clientUnload(): void {
        this.animation.destroy();
    };

    public override clientTick(): void {
        const isEnabled = this.networkData.getBoolean("enable", false);
        const speed = this.networkData.getInt("speed", 20);

        if(!isEnabled || !this.animation.exists()) {
            return;
        };

        const data = BlockSource
        .getCurrentClientRegion()
        .getBlockData(this.x, this.y, this.z);

        const move_coords = {
            x: speed / speed + 10,
            z: 0
        };

        if(data === 0 || data === 2) {
            move_coords.z = move_coords.x;
            move_coords.x = 0;
        };

        this.animation.rotate(move_coords.x, 0, move_coords.z);
    };

    public override onTick(): void {
        if(World.getThreadTime() % 60 === 0) {
            this.networkData.putBoolean("enable", this.data.enable);
            this.networkData.putInt("speed", this.data.speed);
            this.networkData.sendChanges();
        };
    };
};

class WindmillBlades extends BlockForest {
    public constructor() {
        super("windmill_blades", [{
            name: "block.infinite_forest.windmill_blades",
            texture: [["unknown", 0]],
            inCreative: true
        }]);

        Utils.setEmptyBlockCollision(this.id);
    };

    public getTileEntity(): TileEntityBase {
        return new WindmillBladesTile();
    };
};

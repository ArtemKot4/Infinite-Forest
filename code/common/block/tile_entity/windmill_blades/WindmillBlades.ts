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

        Block.setEmptyCollisionShape(this.id);
    };

    public getTileEntity(): CommonTileEntity {
        return new WindmillBladesTile();
    };

    public canRotate(): boolean {
        return true;
    };
};


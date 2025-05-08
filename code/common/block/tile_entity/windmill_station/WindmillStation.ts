class WindmillStation extends BasicBlock {
    public static factory = new Factory();

    public constructor() {
        super("windmill_station", [{
            name: "block.infinite_forest.windmill_station",
            texture: [["windmill_station", 0]],
            inCreative: true
        }]);
    }

    public override getTileEntity(): CommonTileEntity {
        return new WindmillStationTile();
    }
}
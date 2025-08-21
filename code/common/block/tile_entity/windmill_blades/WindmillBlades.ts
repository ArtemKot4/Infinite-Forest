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
        ItemModel.getForWithFallback(this.id, 0).setModel((() => {
            const mesh = LocalWindmillBladesTile.RENDER_SIDE.getWithData(0).clone();
            mesh.translate(0.18, 0.18, 0.18);
            return mesh;
        })(), "terrain-atlas/mill/mill_blades.png");
    }

    public getTileEntity(): CommonTileEntity {
        return new WindmillBladesTile();
    }

    public canRotate(): boolean {
        return true;
    }
}

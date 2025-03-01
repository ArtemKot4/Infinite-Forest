class LocalCauldronTile extends LocalTileEntity {
    public static WATER_RENDERMESH: RenderMesh = (() => {
        const mesh = new RenderMesh();

		mesh.setNormal(0, 1, 0);
		mesh.setColor(43, 133, 76);
        
		mesh.addVertex(-0.4, 0, -0.4, 0, 0);
		mesh.addVertex(0.4, 0, -0.4, 1, 0);
		mesh.addVertex(0.4, 0, 0.4, 1, 1);
		mesh.addVertex(-0.4, 0, -0.4, 0, 0);
		mesh.addVertex(0.4, 0, 0.4, 1, 1);
		mesh.addVertex(-0.4, 0, 0.4, 0, 1);
		return mesh;
    })();

    public static WATER_LEVEL_MAX = 1.3;
    public static BOILING_MAX = 10;

    public defaultValues = {
        water_level: 0.0,
        boiling: 0.0
    };

    public data: typeof this.defaultValues;

    public water_animation!: Animation.Base;

};
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

    public water_animation!: Animation.Base;
    
    public setupAnimation(level: number): void {
        if(level <= 0) {
            this.water_animation && this.water_animation.destroy();
            return;
        };

        if(!this.water_animation) {
            this.water_animation = new Animation.Base(this.x + 0.5, this.y + level, this.z + 0.5);
            this.water_animation.describe({
                mesh: LocalCauldronTile.WATER_RENDERMESH,
                skin: "terrain-atlas/water/water_0.png"
            });
        };
        this.water_animation.setPos(this.x + 0.5, this.y + level, this.z + 0.5);
        this.water_animation.load();
        return;
    };

    @NetworkEvent
    public set_water_render(data: { level: number }): void {
        return this.setupAnimation(data.level || 0);
    };
};
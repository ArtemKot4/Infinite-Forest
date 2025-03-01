TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

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

class CauldronTile extends CommonTileEntity {
    public setWaterLevel(level: number) {

    };
    
    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCauldronTile();
    };
};

class Cauldron extends BasicBlock {
    public factory = new Factory<number[]>();

    public constructor() {
        super("iron_cauldron", [{
            name: "block.infinite_forest.iron_cauldron",
            texture: [["iron_cauldron", 0]],
            inCreative: true
        }]);
    };

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/iron_cauldron", "iron_cauldron");
    };

    public override getTileEntity(): CommonTileEntity {
        return new CauldronTile();
    };
};

Translation.addTranslation("message.infinite_forest.is_not_valid_item", {
    en: "This is not a valid item",
    ru: "Это не подходящий предмет"
});

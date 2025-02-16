TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

class CauldronTile extends TileEntityBase {
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

    public defaultValues = {
        water_level: 0.0
    };

    public data: typeof this.defaultValues;

    public water_animation: Animation.Base;

    public static createWaterAnimation(level: number = CauldronTile.WATER_LEVEL_MAX, coords: Vector) {
        const animation = new Animation.Base(coords.x + 0.5, coords.y + level, coords.z + 0.5);

        animation.describe({
            mesh: CauldronTile.WATER_RENDERMESH,
            skin: "terrain-atlas/water/water_0.png"
        });

        return animation;
    };

    @NetworkEvent(Side.Client)
    public update_water_level(data: { level: number } = { level: CauldronTile.WATER_LEVEL_MAX }) {
        this.water_animation = this.water_animation || CauldronTile.createWaterAnimation(data.level, this);
        this.water_animation.setPos(this.x + 0.5, this.y + data.level, this.z + 0.5);

        this.water_animation.load();
    };

    public setWaterLevel(level: number) {
        this.data.water_level = Math.min(level, CauldronTile.WATER_LEVEL_MAX);
        this.sendPacket("update_water_level", { level: level });
        return;
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        if(item.id === VanillaItemID.water_bucket && this.data.water_level < CauldronTile.WATER_LEVEL_MAX) {
            this.setWaterLevel(CauldronTile.WATER_LEVEL_MAX);
            Entity.setCarriedItem(player, VanillaItemID.bucket, 1, 0);
        };
        return true;
    };
};

class Cauldron extends BlockForest {
    public factory = new Factory<number[]>();

    public constructor() {
        super("iron_cauldron", [{
            name: "block.infinite_forest.iron_cauldron",
            texture: [["iron_cauldron", 0]],
            inCreative: true
        }]);
    };

    public override getModel(): BlockModel | BlockModel[] {
        return new BlockModel("iron_cauldron", "iron_cauldron");
    };

    public override getTileEntity(): TileEntityBase {
        return new CauldronTile();
    };
};

Translation.addTranslation("message.infinite_forest.is_not_valid_item", {
    en: "This is not a valid item",
    ru: "Это не подходящий предмет"
});

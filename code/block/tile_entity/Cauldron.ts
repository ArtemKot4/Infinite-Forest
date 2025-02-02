TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

class CauldronTile extends TileEntityBase {

    public static WATER_RENDERMESH: RenderMesh = (() => {

        const mesh = new RenderMesh();
        const pos = 8 / 16

        mesh.addVertex(- pos, 0, -pos, 0, 0); 
        mesh.addVertex(pos, 0, -pos, 1, 0); 
        mesh.addVertex(-pos, 0, pos, 0, 1); 
        
        mesh.addVertex(pos, 0, -pos, 1, 0); 
        mesh.addVertex(-pos, 0, pos, 0, 1); 
        mesh.addVertex(pos, 0, pos, 1, 1); 

        mesh.scale(1, 0, 1);
        //mesh.setColor(0/256, 137/256, 46/256, 0.8);
        return mesh;
    })();

    public static BOILING_TIME_MAX = 2;

    public defaultValues = {
        progress: 0,
        water_level: 0.0, //max 1.0,
        boiling: false,
        boiling_time: 0
    };

    public data: typeof this.defaultValues;

    public water_animation!: BlockAnimation;

    public item_animations!: Animation.Item[];

    public override clientLoad(): void {
        const water_level = this.networkData.getFloat("water_level", 1.0);

        this.item_animations = [];

        for(let i = 0; i < 8; i++) {
            const animation = new Animation.Item(this.x + Math.random() / 20, this.y + water_level, this.z + Math.random() / 20);
            this.item_animations.push(animation);
        };

        this.water_animation = new BlockAnimation(new Vector3(this.x, this.y, this.z));
        this.water_animation.describe(CauldronTile.WATER_RENDERMESH, "water/water_0");

        if(water_level > 0.0) {
            this.water_animation.load();
        };
    };

    @NetworkEvent(Side.Client)
    public sendWaterAnimation(data: { water_level: number }): void {
        this.water_animation.setPos(this.x, this.y + data.water_level, this.z);
        this.water_animation.refresh();
    };

    @NetworkEvent(Side.Client)
    public describeItemAnimations(items: number[]): void {
        if(this.item_animations && this.item_animations.length > 0) {
            for(const i in this.item_animations) {
                this.item_animations[i].describeItem({
                    id: items[i] || 0,
                    data: 0,
                    count: 1,
                    rotation: [Math.PI / 2, 0, 0]
                });
                this.item_animations[i].load();
            };
        };
    };

    public setBoiling(): void {
        this.data.boiling = true;
    };

    public clearBoiling(): void {
        this.data.boiling = false;
    };

    public hasFireBlock(): boolean {
        return TagRegistry.getAllWithTag("blocks", "fire").includes(this.blockSource.getBlockID(this.x, this.y - 1, this.z));
    };

    public decreaseWaterLevel(): void {
        if(this.data.water_level <= 0.0) return;

        this.data.water_level -= 0.01;
        this.sendWaterAnimation({ water_level: this.data.water_level });
    };

    public onTick(): void {
        const time = World.getThreadTime();

        if(time % 20 === 0) {
            if(this.hasFireBlock()) {
                if(this.data.boiling === false) {
                    this.data.boiling_time++;
    
                    if(this.data.boiling_time >= CauldronTile.BOILING_TIME_MAX) {
                        this.setBoiling();
                    };
                };
            } else {
                this.clearBoiling();
                this.data.boiling_time = 0;
            };
    
            if(this.data.boiling) {
                this.decreaseWaterLevel();
            };

            this.networkData.putBoolean("boiling", this.data.boiling);
            this.networkData.putFloat("water_level", this.data.water_level);
            this.networkData.sendChanges();
        };
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

Callback.addCallback("ItemUse", (coords, item, block) => {
    //if(block.id === VanillaBlockID.coal_block) CauldronTile.setWaterAnimation(1, new BlockAnimation(coords, null), new Vector3(coords.x + 0.5, coords.y + 1, coords.z));
})
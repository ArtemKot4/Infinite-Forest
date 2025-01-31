TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

class CauldronTile extends TileEntityBase {

    public static WATER_RENDERMESH: RenderMesh = (() => {
        const mesh = new RenderMesh();
        mesh.addVertex(-6 / 16, 0, -6 / 16, 0, 0);
        mesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
        mesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
      
        mesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
        mesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
        mesh.addVertex(6 / 16, 0, 6 / 16, 1, 1);

        mesh.setColor(0/256, 137/256, 46/256, 0.8);
        return mesh;
    })();

    public static BOILING_TIME_MAX = 10;

    public defaultValues = {
        progress: 0,
        water_level: 0.0, //max 5,
        boiling: false,
        boiling_time: 0
    };

    public data: typeof this.defaultValues;

    public water_animation!: BlockAnimation;

    public item_animations!: Animation.Item[];

    public clientLoad(): void {
        const water_level = this.networkData.getFloat("water_level", 1.0);
        const boiling = this.networkData.getBoolean("boiling", false);
        
        this.water_animation = new BlockAnimation(new Vector3(this.x + 0.5, this.y + water_level, this.z + 0.5), this);

        for(let i = 0; i < 9; i++) {
            this.item_animations.push(new Animation.Item(this.x + Math.random(), this.y + water_level, this.z + Math.random()))
        };

        this.item_animations.forEach((v) => v.load());
    };

    @BlockEngine.Decorators.ClientSide
    public setItemAnimation(items: number[]): void {
        for(let i = 0; i < this.item_animations.length; i++) {
            let id = items[i];

            const animation = this.item_animations[i];

            animation.describeItem({
                id: id || 0,
                count: 1,
                data: 0,
                size: 0.4,
            });

            animation.load();
        };
    };

    public clientTick(): void {
        const water_level = this.networkData.getFloat("water_level", 1.0);
        const boiling = this.networkData.getBoolean("boiling", false);

        const items = this.networkData.getString("items", "0");

        if(World.getThreadTime() % 20 === 0) {
            this.setItemAnimation(items.split(":").map((v) => Number(v)));
        };
    };

    public onTick(): void {
        const liquidFireBlock = TagRegistry.getAllWithTag("blocks", "fire")
        .includes(this.blockSource.getBlockID(this.x, this.y - 1, this.z));

        const time = World.getThreadTime();

        if(time % 20 === 0) {
            if(!this.data.boiling) {  
                if(liquidFireBlock && this.data.boiling_time < CauldronTile.BOILING_TIME_MAX) {
                    this.data.boiling_time++;
                } else {
                    this.setBoiling();
                };
            };
    
            if(this.data.boiling && !liquidFireBlock) {
                this.clearBoiling();
            };
        };

        this.networkData.sendChanges();
    };

    public setBoiling() {
        this.data.boiling = true;
        this.networkData.putBoolean("boiling", true);
    };

    public clearBoiling() {
        this.data.boiling = false;
        this.data.boiling_time = 0;
        this.networkData.putBoolean("boiling", false)
    };

    @BlockEngine.Decorators.NetworkEvent(Side.Client)
    public setWaterAnimation(obj: { water_level: number }): void {
        const animation = this.water_animation;

        if(animation) {
            animation.describe(CauldronTile.WATER_RENDERMESH, "water/water_0");
            animation.load()
        }
    }

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

    public getModel(): BlockModel | BlockModel[] {
        return new BlockModel("block/iron_cauldron", "iron_cauldron");
    };

    public getTileEntity(): TileEntityBase {
        return new CauldronTile();
    };
};
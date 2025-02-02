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
        water_level: 0.0, //max 1.0,
        boiling: false,
        boiling_time: 0
    };

    public data: typeof this.defaultValues;

    public water_animation!: BlockAnimation;

    public item_animations!: Animation.Item[];

    public override clientLoad(): void {
        const water_level = this.networkData.getFloat("water_level", 1.0);
        const boiling = this.networkData.getBoolean("boiling", false);
        
        this.water_animation = new BlockAnimation(new Vector3(this.x + water_level, this.y + water_level, this.z + 0.5), this);

        for(let i = 0; i < 9; i++) {
            this.item_animations.push(new Animation.Item(this.x + Math.random(), this.y + water_level, this.z + Math.random()))
        };

        this.item_animations.forEach((v) => v.load());
    };

    public override clientUnload(): void {
        this.item_animations.forEach((v) => v.destroy());
        this.water_animation.destroy();
    };

    public spawnBubbles(water_level: number) {
        for(let i = -0.8; i < 0.8; i++) {
            Particles.addParticle(EParticleType.BUBBLE, this.x + i, this.y + water_level, this.z - i, 0, 0, 0);
            Particles.addParticle(EParticleType.BUBBLE, this.x - i, this.y + water_level, this.z + i, 0, 0 ,0);
        };
    };

    public describeItemAnimation(items: number[]): void {
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

    public override clientTick(): void {
        const water_level = this.networkData.getFloat("water_level", 1.0);
        const boiling = this.networkData.getBoolean("boiling", false);

        const items = this.networkData.getString("items", "0");

        if(World.getThreadTime() % 20 === 0) {
            this.describeItemAnimation(items.split(":").map((v) => Number(v)));
        };

        if(boiling) {
            this.spawnBubbles(water_level);
            this.setWaterAnimation({ water_level: water_level });
        };
    };

    public override onTick(): void {
        if(this.data.water_level <= 0) {
            this.water_animation.destroy();
            return;
        };

        const liquidFireBlock = TagRegistry.getAllWithTag("blocks", "fire")
        .includes(this.blockSource.getBlockID(this.x, this.y - 1, this.z));

        const time = World.getThreadTime();

        if(time % 20 === 0) {
            Game.message("work")
            if(!this.data.boiling) {  
                if(liquidFireBlock && this.data.boiling_time < CauldronTile.BOILING_TIME_MAX) {
                    this.data.boiling_time++;
                } else {
                    this.setBoiling();
                };
            };
    
            if(this.data.boiling) {
                if(!liquidFireBlock) this.clearBoiling();
                this.decreaseWaterLevel();
            };
        };

        this.networkData.sendChanges();
    };

    public setBoiling() {
        this.data.boiling = true;
        this.networkData.putBoolean("boiling", true);
    };

    public decreaseWaterLevel() {
        if(this.data.water_level <= 0) {
            return;
        };

        this.data.water_level -= 0.05;
        this.networkData.putFloat("water_level", this.data.water_level);
    };

    public clearBoiling() {
        this.data.boiling = false;
        this.data.boiling_time = 0;
        this.networkData.putBoolean("boiling", false)
    };

    public override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        Game.message(JSON.stringify(this.data) + "\n" + "работает"); //todo: debug
        
        const isWaterLiquidItem = !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");

        if(!isWaterLiquidItem) {
            return Utils.actionbarMessage(player, Translation.translate("message.infinite_forest.is_not_valid_item"));
        };

        this.clearBoiling();
        this.data.water_level = 1.0;

        this.sendPacket("setWaterAnimation", { water_level: this.data.water_level });
        return;
    };

    @BlockEngine.Decorators.NetworkEvent(Side.Client)
    public setWaterAnimation(obj: { water_level: number }): void {
        const animation = this.water_animation;

        if(animation) {
            animation.setPos(this.x, this.y + obj.water_level, this.z);
            animation.describe(CauldronTile.WATER_RENDERMESH, "water/water_0");
            animation.refresh();
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
})
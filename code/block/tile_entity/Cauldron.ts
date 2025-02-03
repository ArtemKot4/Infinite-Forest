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

        this.water_animation = new BlockAnimation(new Vector3(this.x, this.y + 1, this.z));
        this.water_animation.describe(CauldronTile.WATER_RENDERMESH, "water/water_0");

        if(water_level > 0.0) {
            this.water_animation.load();
        };
    };

    @NetworkEvent(Side.Client)
    public sendWaterAnimationPacket(data: { water_level: number }): void {
        if(this.water_animation) {
            this.water_animation.setPos(this.x, this.y + data.water_level, this.z);
            this.water_animation.load();
        };
    };

    @NetworkEvent(Side.Client)
    public describeItemAnimationsPacket(obj: { items: number[] }): void {
        if(this.item_animations && this.item_animations.length > 0) {
            for(const i in this.item_animations) {
                this.item_animations[i].describeItem({
                    id: obj.items[i] || 0,
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

    public updateWaterVisual(): {} {
        return this.sendPacket("sendWaterAnimationPacket", { water_level: this.data.water_level });
    };

    public decreaseWaterLevel(): void {
        if(this.data.water_level <= 0.0) return;

        this.data.water_level = Math.max(0, this.data.water_level - 0.01);
        this.updateWaterVisual();
        return;
    };

    public override onTick(): void {
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
    
            if(this.data.boiling === true) {
                this.decreaseWaterLevel();
            };

            this.networkData.putFloat("water_level", this.data.water_level);
            this.networkData.putBoolean("boiling", this.data.boiling);
            //this.networkData.putFloat("water_level", this.data.water_level);
            this.networkData.sendChanges();
            return;
        };
    };

    public override clientTick(): void {
        const boiling = this.networkData.getBoolean("boiling", false);
        const water_level = this.networkData.getFloat("water_level", 0.0);

        if(boiling && water_level > 0.0) {
            for(let i = -0.8; i <= 0.8; i += 0.1) {
                Particles.addParticle(EParticleType.BUBBLE, this.x + i, this.y + water_level, this.z - i, 0, 0 ,0);
                Particles.addParticle(EParticleType.BUBBLE, this.x - i, this.y + water_level, this.z + i, 0, 0 ,0);
            };
        };
    };

    public findValidIndex(item: ItemInstance): number {
        for(let i = 0; i < 8; i++) {
            const slot = this.container.getSlot("slot_" + i);
            if(slot.id === 0 || (slot.id === item.id && slot.count < 64)) return i;
        };
        return -1;
    };

    public findFullIndex(): number {
        for(let i = 8; i > 0; i--) {
            if(this.container.getSlot("slot_" + i).id !== 0) return i;
        };
        return -1;
    };

    public updateVisualItems(): {} {
        const items: number[] = [];

        for(let i = 0; i < 9; i++) {
            const slot = this.container.getSlot("slot_" + i);
            if(slot.id !== 0) {
                items.push(slot.id);
            }; 
        }
        return this.sendPacket("describeItemAnimationsPacket", { items });
    };

    public takeItem(player: number, item: ItemInstance): void {
        const index = this.findFullIndex();
        if(index > -1) {
            const slot = this.container.getSlot("slot_" + index);

            const entity = new PlayerEntity(player);

            if(entity.getCarriedItem().id === 0) {
                entity.setCarriedItem(slot.id, 1, slot.data, slot.extra);
            } else {
                entity.addItemToInventory(slot.id, 1, slot.data, slot.extra);
            };

            this.container.setSlot("slot_" + index, item.id, slot.count - 1, item.data, item.extra);
        }
    };

    public putItem(player: number, item: ItemInstance): void {
        const index = this.findValidIndex(item);
        if(index > -1) {
            const slot = this.container.getSlot("slot_"+index);

            const entity = new PlayerEntity(player);

            entity.decreaseCarriedItem(1);

            const count = index === item.id ? slot.count + 1 : 1;

            this.container.setSlot("slot_" + index, slot.id, count, slot.data, slot.extra);
        };
    };

    public override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        Game.message(JSON.stringify(this.data));

        if(item.id === VanillaItemID.water_bucket) {
            alert("вода")

            this.data.water_level = 1.0;
            this.data.boiling = false;
            this.data.boiling_time /= 2;

            Entity.setCarriedItem(player, VanillaItemID.bucket, 1, 0);
            this.updateWaterVisual();
            return;
        };


        if(Entity.getSneaking(player) === true) {
            this.takeItem(player, item);
        } else {
            this.putItem(player, item);
        };
        this.updateVisualItems();
        return;
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
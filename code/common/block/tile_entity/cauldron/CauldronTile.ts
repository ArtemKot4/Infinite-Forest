TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

class CauldronTile extends CommonTileEntity {
    public static WATER_LEVEL_MAX = 1.3;
    public static BOILING_TIME = 10;

    public override data = {
        waterLevel: 0.0,
        boiling: 0.0
    };

    public setWaterLevel(level: number): void {
        this.data.waterLevel = level;
        this.sendPacket("set_water_render", { level });
        return;
    };

    public clearBoiling() {
        this.data.boiling = 0;
        this.networkData.putBoolean("boiling", false);
        this.networkData.sendChanges();
    };

    public addItem(item: ItemStack, user: PlayerUser): number | boolean {
        for(let i = 0; i < 9; i++) {
            const slot_name = "slot" + i;

            if(this.container.getSlot(slot_name).id === 0) {
                user.decreaseCarriedItem(1);
                this.container.setSlot(slot_name, item.id, 1, item.data, item.extra);
                
                return i;
            };
        };
        return false;
    };

    public takeItem(user: PlayerUser): number {
        for(let i = 9; i >= 0; i--) {
            const slot_name = "slot" + i;

            if(this.container.getSlot(slot_name).id !== 0) {
                user.addItemToInventory(this.container.getSlot(slot_name));
                this.container.setSlot(slot_name, 0, 0, 0, null);

                return i;
            };
        };
        return 0;
    };

    public override onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean | void {
        if(item.id === VanillaItemID.water_bucket) {
            this.setWaterLevel(CauldronTile.WATER_LEVEL_MAX);
            Entity.setCarriedItem(player, VanillaItemID.bucket, 1, 0);
            this.clearBoiling();
            return;
        } else {
            if(item.isEmpty() && this.data.boiling >= CauldronTile.BOILING_TIME) {
                Entity.damageEntity(player, 1);
                Game.tipMessage("zzz");
            } else {
                const user = new PlayerUser(player);

                if(!user.isSneaking()) {
                    const add = this.addItem(item, user);

                    if(add === false) { 
                        this.takeItem(user); 
                    } else {
                        this.addItem(item, user);
                    };
                    return;
                };

                if(user.isSneaking()) {
                    this.takeItem(user);
                };
            };
        };
    };
    
    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCauldronTile();
    };
};
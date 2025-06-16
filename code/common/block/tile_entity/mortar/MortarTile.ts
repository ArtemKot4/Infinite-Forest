class MortarTile extends CommonTileEntity {
    public static readonly PROGRESS_MAX = 20;
    public override defaultValues = {
        id: 0,
        count: 0,
        data: 0,
        pestle: false,
        time: 0,
        progress: 0
    }

    public data: typeof this.defaultValues;
    
    public override onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean | void {
        const user = new PlayerUser(player);

        if(Entity.getSneaking(player) == false) { 
            if(this.data.pestle == false) {
                if(item.id == VanillaBlockID.cobblestone_wall) {
                    user.decreaseCarriedItem(item.count);
                    this.setPestle();
                }
            } else {
                this.sendTime(100);
            }
        } else {
            this.sendPacket("create_item_render", item || null);
            if(item.isEmpty() == false) {
                if(this.data.id != 0) {
                    this.drop();
                }
                this.setItem(item);
                user.decreaseCarriedItem(item.count);
            }
            this.networkData.putInt("item", item.id);
        }
        this.networkData.sendChanges();
    }

    public drop(): void {
        if(!this.data.id || !this.data.count) {
            return;
        }

        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.id, this.data.count, this.data.data);
        this.data.id = 0;
        this.data.count = 0;
        this.data.data = 0;
    }

    public onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        this.drop();
        if(this.data.pestle == true) {
            this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, VanillaBlockID.cobblestone_wall, 1, 0);
        }
    }

    public override onTick(): void {
        if(this.data.time > 0) {
            if(this.data.time == 1 && this.data.progress < MortarTile.PROGRESS_MAX) {
                this.data.progress++;
            }
            if(World.getThreadTime() % 20 == 0) {
                for(const i in Mortar.recipes) {
                    const recipe = Mortar.recipes[i];
                    if(this.data.id == Number(i) && this.data.progress >= recipe.progress) {
                        if(this.data.count > 1) {
                            this.data.count--;
                            this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, recipe.id, 1, this.data.data);
                        } else if(this.data.count == 1) {
                            this.setItem(new ItemStack(recipe.id, this.data.count, this.data.data));
                        } 
                        if(this.data.count == 0) {
                            this.clearItem();
                        }
                        this.data.progress = 0;
                        
                        this.sendPacket("create_item_render", this.data);
                        this.networkData.putInt("item", this.data.id);
                        this.networkData.sendChanges();
                    }
                }
            }
            this.sendTime(this.data.time - 1);
        }
    }

    public override onProjectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {
        if(Entity.getType(target.entity) == EEntityType.ARROW) {
            this.blockSource.destroyBlock(coords.x, coords.y, coords.z, true);
        }
    }

    public setPestle(): void {
        this.data.pestle = true;
        
        this.sendPacket("create_pestle_render", {});
        this.networkData.putBoolean("pestle", this.data.pestle);
    }

    public sendTime(time: number): void {
        this.data.time = time;

        this.networkData.putInt("time", this.data.time);
        this.networkData.sendChanges();
    }

    public clearItem(): void {
        this.data.id = 0;
        this.data.count = 0;
        this.data.data = 0;
    }

    public setItem(item: ItemStack): void {
        this.data.id = item.id;
        this.data.count = item.count;
        this.data.data = item.data;
    }

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalMortarTile();
    }
}
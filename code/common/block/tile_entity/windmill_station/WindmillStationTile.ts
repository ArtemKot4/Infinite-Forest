class LocalWindmillStationTile extends LocalTileEntity {
    public override onTick(): void {
        if(World.getThreadTime() % 5 === 0) {
            const id = this.networkData.getInt("inputId", 0);
            const enabled = this.networkData.getBoolean("enabled", false);

            if(!enabled) {
                return;
            }

            ParticleHelper.spawnElectric(this.x + 0.5, this.y + 1.05, this.z + 0.5);

            if(id != 0) {
                for(let i = 0; i < 3; i++) {
                    Particles.addBreakingItemParticle(
                        Network.serverToLocalId(id), 
                        0, 
                        this.x + 0.5, 
                        this.y - 0.1, 
                        this.z + 0.5
                    );
                }
            }
        }
    }
}

class WindmillStationTile extends CommonTileEntity {
    public override data = {
        enabled: false,
        progress: 0,
        progressMax: 10,
        inputId: 0,
        inputCount: 0,
        height: 0
    }

    public override onTick(): void {
        if(World.getThreadTime() % 20 === 0) {
            if(!this.data.enabled) {
                return;
            }
            this.setUpperItems();

            if(!this.hasValidItem()) {
                return;
            }

            if(!this.isRightItem()) {
                return this.drop({ id: this.data.inputId, count: 1, data: 0 });
            }

            const currentWeather = World.getWeather();

            const progressCount = (
                Math.floor(currentWeather.rain / 3) + Math.floor(currentWeather.thunder / 3)
            ) + Math.min(7, this.data.height / 10);

            this.networkData.putInt("inputId", this.data.inputId);
            this.networkData.putBoolean("enabled", this.data.enabled);
            this.networkData.sendChanges();

            WindmillStation.factory.forEach((field) => {
                if(this.data.inputId == field.input[0].id) {
                    this.data.progress += progressCount;
                }

                if(this.data.progress >= this.data.progressMax) {
                    this.drop(field.result);
                    this.data.progress = 0;
                }
                
                return;
            });
        }
    }

    public override onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        const vectors = [
            [this.x, this.z + 1],
            [this.x, this.z - 1],
            [this.x + 1, this.z],
            [this.x - 1, this.z] 
        ];

        for(const i in vectors) {
            const id = this.blockSource.getBlockID(vectors[i][0], this.y, vectors[i][1]);

            if(id === BlockList.WINDMILL_BLADES.getID()) {
                BasicBlock.destroyWithTile(vectors[i][0], this.y, vectors[i][1], this.blockSource);
            }
        }
        this.dropAll();
    }

    public setUpperItems(): void {
        const itemEntities = this.blockSource.listEntitiesInAABB(
            this.x, this.y + 1, this.z,
            this.x + 1, this.y + 2, this.z + 1, 
            EEntityType.ITEM, false
        );

        if(itemEntities.length > 0) {
            for(const itemEntity of itemEntities) {
                const item = Entity.getDroppedItem(itemEntity);

                if(!item) {
                    continue;
                }

                if(this.hasValidItem() && this.data.inputId != item.id) {
                    continue;
                }

                this.addItem(item);
                Entity.remove(itemEntity);                
            }
        }
    }

    public addItem(instance: ItemInstance): void {
        if(instance && instance.id) {
            this.data.inputId = instance.id;
            this.data.inputCount += instance.count;
        }
    }

    public drop(instance: ItemInstance): void {
        if(!this.hasValidItem()) {
            return;
        }

        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y - 1, this.z + 0.5, instance.id, instance.count || 1, instance.data || 0);
        this.decrease();
        return;
    }

    public hasValidItem(): boolean {
        return this.data.inputId != 0;
    }

    public decrease(): void {
        if(this.data.inputCount > 0) {
            this.data.inputCount -= 1;

            if(this.data.inputCount == 0) {
                this.data.inputId = 0;
            }
        }
    }

    public isRightItem(): boolean {
        return WindmillStation.factory.field.some((v) => v.input[0].id == this.data.inputId);
    }

    public dropAll(): void {
        if(!this.hasValidItem()) return;

        const stack = new ItemStack(this.data.inputId, this.data.inputCount);

        this.data.inputId = 0;
        this.data.inputCount = 0;

        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, stack.id, stack.count, stack.data);
        return;
    }
}
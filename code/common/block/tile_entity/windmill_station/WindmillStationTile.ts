class LocalWindmillStationTile extends LocalTileEntity {
    public override onTick(): void {
        if(World.getThreadTime() % 5 === 0) {
            const id = this.networkData.getInt("inputId", 0);
            const enabled = this.networkData.getBoolean("enabled", false);

            if(!enabled) {
                return;
            };

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
                };
            };   
        };
    };
};

class WindmillStationTile extends CommonTileEntity {
    public override data = {
        enabled: false,
        progress: 0,
        progress_max: 10,
        inputId: 0,
        input_count: 0,
        height: 0
    };

    public setUpperItems(): void {
        const itemEntities = this.blockSource.listEntitiesInAABB(
            this.x, this.y + 1, this.z,
            this.x + 1, this.y + 2, this.z + 1, 
            EEntityType.ITEM, false
        );

        if(itemEntities.length > 0) {
            for(const item_entity of itemEntities) {

                if(Entity.getType(item_entity) !== Native.EntityType.ITEM) {
                    continue;
                };

                const item = Entity.getDroppedItem(item_entity);

                if(!item) {
                    continue;
                };

                if(this.isValidItem() && this.data.inputId !== item.id) {
                    continue;
                };

                this.addItem(item);
                
                Entity.remove(item_entity);                
            };
        };
    };

    public addItem(instance: ItemInstance): void {
        if(instance && instance.id) {
            this.data.inputId = instance.id;
            this.data.input_count += instance.count;
        };
    };

    public drop(id: number) {
        if(!this.isValidItem()) return;

        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y - 1, this.z + 0.5, id, 1, 0);
        this.decrease();
        return;
    };

    public isValidItem(): boolean {
        return this.data.inputId !== 0;
    };

    public decrease(): void {
        if(this.data.input_count > 0) {

            this.data.input_count -= 1;

            if(this.data.input_count === 0) {
                this.data.inputId = 0;
            };
        };
    };

    public override onTick(): void {
        if(!this.data.enabled) return;

        if(World.getThreadTime() % 20 === 0) {
            this.setUpperItems();

            if(!this.isValidItem()) return;

            if(!this.isRightItem()) {
                return this.drop(this.data.inputId);
            };

            const currentWeather = World.getWeather();

            const progress_count = (
                Math.floor(currentWeather.rain / 3) + Math.floor(currentWeather.thunder / 3)
            ) + Math.min(7, this.data.height / 10);

            this.networkData.putInt("inputId", this.data.inputId);
            this.networkData.putBoolean("enabled", this.data.enabled);

            this.networkData.sendChanges();

            BlockList.WINDMILL_STATION.factory.forEach((result, input) => {
                if(this.data.inputId === input) {
                    this.data.progress += progress_count;
                };

                if(this.data.progress >= this.data.progress_max) {
                    this.drop(result);
                    this.data.progress = 0;
                };
                
                return;
            });
        };
    };

    public isRightItem(): boolean {
        return Object.values(BlockList.WINDMILL_STATION.factory.field).includes(this.data.inputId);
    };

    public dropAll(): void {
        if(!this.isValidItem()) return;

        const stack = new ItemStack(this.data.inputId, this.data.input_count);

        this.data.inputId = 0;
        this.data.input_count = 0;

        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, stack.id, stack.count, stack.data);
        return;
    };

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
            };
        };

        this.dropAll();
    };
};
class Factory<InputFormat extends Record<string, ItemInstance> | ItemInstance | number> {
    public field: { [result_id: number]: InputFormat } = {};

    public addRecipe(result: number, input: InputFormat): this {
        this.field[result] = input;
        return this;
    };

    public forEach(callback: (result: number, input: InputFormat) => void): void {
        for(const id in this.field) {
            callback(Number(id), this.field[id]);
        };
    };
    
};

class WindmillStationTile extends TileEntityBase {
    public defaultValues = {
        enable: false,
        progress: 0,
        progress_max: 5,
        input_id: 0,
        input_count: 0
    };

    public data: typeof this.defaultValues;

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

                Game.message(JSON.stringify(item));

                if(this.isValidItem() && this.data.input_id !== item.id) {
                    continue;
                };

                this.addItem(item);
                
                Entity.remove(item_entity);                
            };
        };
    };

    public addItem(instance: ItemInstance): void {
        if(instance && instance.id) {
            this.data.input_id = instance.id;
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
        return this.data.input_id !== 0;
    };

    public decrease(): void {
        if(this.data.input_count > 0) {

            this.data.input_count -= 1;

            if(this.data.input_count === 0) {
                this.data.input_id = 0;
            };
        };
    };

    public override onTick(): void {
        if(!this.data.enable) return;

        if(World.getThreadTime() % 20 === 0) {
            this.setUpperItems();

            if(!this.isValidItem()) return;

            if(!this.isRightItem()) {
                return this.drop(this.data.input_id);
            };

            this.networkData.putInt("input_id", this.data.input_id);
            this.networkData.putBoolean("enable", this.data.enable);

            this.networkData.sendChanges();

            BlockList.WINDMILL_STATION.factory.forEach((result, input) => {
                if(this.data.input_id === input) {
                    this.data.progress += 1;
                };

                if(this.data.progress >= this.data.progress_max) {
                    this.drop(result);
                    this.data.progress = 0;
                };
                
                return;
            });
        };
    };

    public override clientTick(): void {
        if(World.getThreadTime() % 5 === 0) {
            const id = this.networkData.getInt("input_id", null);
            const isEnabled = this.networkData.getBoolean("enable", false);

            if(!isEnabled) {
                return;
            };

            if(id) {
               return Particles.addBreakingItemParticle(id, 0, this.x + 0.5, this.y - 1.08, this.z + 0.5);
            };

            spawnElectric(this);
        };
    };

    public isRightItem(): boolean {
        return Object.values(BlockList.WINDMILL_STATION.factory.field).includes(this.data.input_id);
    };

    public override destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        const vectors = [
            [this.x, this.z + 1],
            [this.x, this.z - 1],
            [this.x + 1, this.z],
            [this.x - 1, this.z] 
        ];

        for(const i in vectors) {
            const id = this.blockSource.getBlockID(vectors[i][0], this.y, vectors[i][1]);

            if(id === BlockList.WINDMILL_BLADES.getID()) {
                TileEntity.destroyTileEntityAtCoords(vectors[i][0], this.y, vectors[i][1], this.blockSource);
                this.blockSource.destroyBlock(vectors[i][0], this.y, vectors[i][1], true);
            };
        };

        this.dropAll();
    };

    public dropAll(): void {
        if(!this.isValidItem()) return;

        const stack = new ItemStack(this.data.input_id, this.data.input_count);

        this.data.input_id = 0;
        this.data.input_count = 0;

        this.region.dropItem(new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5), stack);
        return;
    }
};

class WindmillStation extends BlockForest {
    public factory = new Factory<number>();

    public constructor() {
        super("windmill_station", [{
            name: "block.infinite_forest.windmill_station",
            texture: [["windmill_station", 0]],
            inCreative: true
        }]);
    };

    public override getTileEntity(): TileEntityBase {
        return new WindmillStationTile();
    };
};
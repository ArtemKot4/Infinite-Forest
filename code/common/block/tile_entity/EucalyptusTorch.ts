class EucalyptusTorchTile extends TileEntityBase {
    public override clientTick(): void {
        const enabled = this.networkData.getBoolean("enabled", true);
        if(!enabled) return;

        const height = this.networkData.getFloat("height", 2);
        const rainSpeed = this.networkData.getFloat("speed", 0.2);
        const rainDensity = this.networkData.getInt("rain_density", 1);

        const rainHeight = height + 0.1;
        const cloudsHeight = height + 0.5;

        for(let i = 0; i < rainDensity; i++) {
            Particles.addParticle(
                EForestParticle.GREEN_RAIN, 
                this.x - 0.5 + randomInt(0.3, 0.6),
                this.y + rainHeight,
                this.z - 0.5 + randomInt(0.3, 0.5),
                0.01,
                -rainSpeed,
                0.01
            );
        };

        for(let i = 0; i <= 6; i++) {
            Particles.addParticle(
                EForestParticle.CLOUD,
                this.x - 0.5 + randomInt(0.3, 0.6),
                this.y + cloudsHeight,
                this.z - 0.5 + randomInt(0.3, 0.6),
                0,
                0,
                0
            );
        };
    };

    public override onTick(): void {
        const time = World.getThreadTime();

        if(time % 30 === 0) {
            if(!Curse.has("cursed_lightning")) {
                this.networkData.putBoolean("enabled", false);
                return;
            };
            
            const cauldronTile = this.findCauldronWithTile();

            let height = 2;

            if(cauldronTile != null) {
                height = 4;
                const waterLevel = cauldronTile.data.water_level;

                if(waterLevel < 1) {
                    
                   this.addLearnings();
                   this.updateCauldronWaterLevel(cauldronTile);
                };
            };

            const lightlevel = this.blockSource.getLightLevel(this.x, this.y, this.z);
            const speed = lightlevel < 4 ? 0.2 : lightlevel / 35;

            this.networkData.putInt("rain_density", Math.floor(lightlevel < 8 ? lightlevel / 2 : lightlevel / 4));
            this.networkData.putFloat("speed", speed);
            this.networkData.putFloat("height", height);
            this.networkData.sendChanges();
        };
        return;
    };

    public findCauldronWithTile(): Nullable<CauldronTile & TileEntity> {
        if(this.blockSource.getBlockID(this.x, this.y + 2, this.z) === BlockList.CAULDRON.id) {
            return TileEntity.getTileEntity(this.x, this.y + 2, this.z, this.blockSource) as CauldronTile & TileEntity;
        };
        return null;
    };

    public updateCauldronWaterLevel(tile_entity: CauldronTile): void {
        tile_entity.data.water_level += 0.25;
        tile_entity.updateWaterVisual();
        return;
    };

    public addLearnings(): void {
        const players = this.blockSource.listEntitiesInAABB(
            this.x - 10,
            this.y - 10,
            this.z - 10,
            this.x + 10,
            this.y + 10,
            this.z + 10,
            EEntityType.PLAYER,
            false
        );

        players.forEach((player) => Learning.giveFor(player, "cauldron_lifehack"));
        return;
    };
};

class EucalyptusTorchUnlit extends BlockForest implements IBlockModel {
    public constructor() {
        super("eucalyptus_torch_unlit", [{
            name: "block.infinite_forest.eucalyptus_torch",
            texture: [["eucalyptus_torch", 0]],
            inCreative: true
        }]);
    };

    public override getMaterial(): string {
        return "wood";
    };

    public override getSoundType(): Block.Sound {
        return "wood";
    };

    public override getModel(): BlockModel | BlockModel[] {
        return new BlockModel("eucalyptus_torch");
    };

    public override getTileEntity(): TileEntityBase {
        return new EucalyptusTorchTile();
    };
    
};
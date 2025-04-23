class EucalyptusTorchTile extends CommonTileEntity {
    public override onTick(): void {
        const time = World.getThreadTime();

        if(time % 30 === 0) {
            if(!Curse.has("cursed_lightning")) {
                this.networkData.putBoolean("enabled", false);
                return;
            };

            const lightlevel = this.blockSource.getLightLevel(this.x, this.y, this.z);
            const rain_density = Math.floor(lightlevel < 8 ? lightlevel / 2 : lightlevel / 4);
            const speed = lightlevel < 4 ? 0.2 : lightlevel / 35;

            const cauldronTile = this.findCauldronWithTile();

            let height = 2;

            if(cauldronTile != null) {
                height = 4;
                const waterLevel = cauldronTile.data.water_level;

                if(waterLevel < 1.0 && rain_density >= 1) {
                   this.addLearnings();
                   this.updateCauldronWaterLevel(cauldronTile);
                };
            };

            this.networkData.putInt("rain_density", rain_density);
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

    public updateCauldronWaterLevel(tileEntity: CauldronTile): void {
        tileEntity.setWaterLevel(tileEntity.data.waterLevel += 0.25);
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

    public getLocalTileEntity(): LocalTileEntity {
        return new LocalEucalyptusTorchTile();
    };
};
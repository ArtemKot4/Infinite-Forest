class WindmillBladesTile extends CommonTileEntity {
    public override defaultValues = {
        enabled: false, //false
        speed: 0.05
    }

    public data: typeof this.defaultValues;

    public initDestroy() {
        this.blockSource.destroyBlock(this.x, this.y, this.z, true);
        this.selfDestroy();
        return;
    }

    public override onLoad(): void {
        const stationTile = this.getStationTile();
        const height = this.findHeight();

        if(!stationTile || height < 10) {
            this.sendPacket("break_particle", {});
            this.initDestroy();
            return;
        }

        if(EBiomeState.is(this.x, this.z, this.blockSource) == EBiomeState.COLD) {
            this.networkData.putFloat("speed", 0.005);
        } else {
            this.data.enabled = true;
        }

        this.networkData.putBoolean("enabled", this.data.enabled || false);
        this.networkData.sendChanges();
    }

    public override onTick(): void {
        if(World.getThreadTime() % 60 === 0) {
            const height = this.findHeight();
            const currentWeather = World.getWeather();

            this.networkData.putBoolean("enabled", this.data.enabled);
            this.networkData.putFloat("speed", currentWeather.rain > 0 ? this.data.speed * 2 : this.data.speed);
            this.networkData.putInt("height", height);
            
            const stationTile = this.getStationTile();
            if(stationTile !== null) {
                stationTile.data.height = height;
            }

            this.switchStationMode(this.data.enabled);
            this.networkData.sendChanges();
            return;
        }
    }

    public override onDestroyTile(): boolean {
        this.switchStationMode(false);
        return false;
    }

    public switchStationMode(value: boolean): void {
        const stationTile = this.getStationTile();

        if(stationTile != null) {
            stationTile.data.enabled = value;
            stationTile.networkData.putBoolean("enabled", value);
            stationTile.networkData.sendChanges()
        }            
        return;                        
    }

    public getStationTile(): Nullable<WindmillStationTile & TileEntity> {
        const vectors = [
            [this.x, this.z + 1],
            [this.x, this.z - 1],
            [this.x + 1, this.z],
            [this.x - 1, this.z] 
        ];

        for(const i in vectors) {
            const id = this.blockSource.getBlockID(vectors[i][0], this.y, vectors[i][1]);

            if(id === BlockList.WINDMILL_STATION.id) {
                return TileEntity.getTileEntity(vectors[i][0], this.y, vectors[i][1], this.blockSource) as WindmillStationTile & TileEntity;
            }
        }

        return null;
    }

    public findHeight(): number {
        let height = 1;

        while(this.blockSource.getBlockID(this.x, this.y - height, this.z) == 0) {
            height++;
        }
        return height;
    }

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalWindmillBladesTile();
    }
}
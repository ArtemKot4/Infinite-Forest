class CandleTile extends CommonTileEntity {
    public override data = {
        flames: 0
    };
    
    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        const blockData = this.blockSource.getBlockData(coords.x, coords.y, coords.z);

        if(this.data.flames < Candle.meshes.length && item.id === VanillaItemID.flint_and_steel) {
            const isIncreased = this.increaseFlames();

            if(isIncreased) {
                Entity.setCarriedItem(player, item.id, item.count, item.data + 1, item.extra);
            };
            return;
        };

        if(blockData < (Candle.meshes.length - 1) && TagRegistry.getBlockTags(item.id).includes("candle")) {
            const entity = new PlayerUser(player);

            entity.decreaseCarriedItem(1);
            BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y, coords.z, this.blockID, this.blockSource.getBlockData(this.x, this.y, this.z) + 1);
        };
    };

    public increaseFlames(): boolean {
        const blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
        const increasedFlame = Math.min(this.data.flames + 1, Candle.meshes.length);

        if(increasedFlame !== blockData || this.data.flames === increasedFlame) return false;

        this.data.flames = increasedFlame;

        this.blockSource.setBlock(this.x, this.y, this.z, BlockID["candle_lit_" + increasedFlame], blockData);
        TileEntity.addTileEntity(this.x, this.y, this.z, this.blockSource);
        
        this.networkData.putInt("flames", increasedFlame);
        this.networkData.sendChanges();
        return true;
    };

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCandleTile();
    }
};


class CandleTile extends CommonTileEntity {
    public override defaultValues = {
        flames: 0
    }

    public data: typeof this.defaultValues;
    
    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        const blockData = this.blockSource.getBlockData(coords.x, coords.y, coords.z);

        if(item.id == VanillaItemID.flint_and_steel && this.data.flames < Candle.meshes.length) {
            return this.increaseFlames();
        }

        if(blockData < (Candle.meshes.length - 1) && TagRegistry.getBlockTags(item.id).includes("candle")) {
            const entity = new PlayerUser(player);

            entity.decreaseCarriedItem(1);
            BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y, coords.z, this.blockID, this.blockSource.getBlockData(this.x, this.y, this.z) + 1);
        }
    }

    public increaseFlames(): boolean {
        const blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
        const increasedFlame = Math.min(this.data.flames + 1, Candle.meshes.length);

        if(increasedFlame != blockData || this.data.flames == increasedFlame) {
            return;
        }
        this.data.flames = increasedFlame;

        this.blockSource.setBlock(this.x, this.y, this.z, BlockID["candle_lit_" + blockData], blockData);
        this.networkData.putInt("flames", increasedFlame);
        this.networkData.sendChanges();
    }

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCandleTile();
    }
}


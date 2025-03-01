TagRegistry.addCommonObject("blocks", VanillaBlockID.fire, ["fire"]);

class CauldronTile extends CommonTileEntity {
    public setWaterLevel(level: number) {

    };
    
    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCauldronTile();
    };
};

class MultiBlock extends TileEntityBase {
    public getBlock(x: int, y: int, z: int, id: int) {
        return this.blockSource.getBlockId(x, y, z) === id
    };
    public getBlockByTile(x: int, y: int, z: int, id: int) {
        return this.getBlock(x, y, z, id) && TileEntity.getTileEntity(x, y, z, this.blockSource);
    };
    public getBlockDatas(x: int, y: int, z: int, data) {
        return TileEntity.getTileEntity(x, y, z, this.blockSource)[data];
    };
    public setBlockDatas(x, y, z, value, data) {
      
        TileEntity.getTileEntity(x, y, z, this.blockSource)[value] = data
    }
};

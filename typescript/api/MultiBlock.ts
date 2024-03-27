
class MultiBlock extends TileEntityBase {
    public getBlock(x: int, y: int, z: int, id: int) {
        return this.blockSource.getBlockId(x, y, z) === id
    };
    public getBlockDatas(x: int, y: int, z: int, value) {
        if(TileEntity.getTileEntity(x, y, z)) {
        return TileEntity.getTileEntity(x, y, z, this.blockSource)["data"][value];
        } else {
            Game.message("Извините, но tile entity не найден для получения данных")
        }
    };
    public setBlockDatas(x, y, z, value, data) {
      if(TileEntity.getTileEntity(x, y, z, this.blockSource)) {
        return TileEntity.getTileEntity(x, y, z, this.blockSource)["data"][value] = data
      }
    }
};

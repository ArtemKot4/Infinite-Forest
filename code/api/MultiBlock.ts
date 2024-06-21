
class MultiBlock extends TileEntityBase {
    public getBlock(x: int, y: int, z: int, id: int) {
        return this.blockSource.getBlockId(x, y, z) === id
    };
    public getBlockDatas(x: int, y: int, z: int, value) {
        
        return TileEntity.getTileEntity(x, y, z) &&
        TileEntity.getTileEntity(x, y, z, this.blockSource)["data"][value];

    };
    public setBlockDatas(x, y, z, value, data) {
      if(TileEntity.getTileEntity(x, y, z, this.blockSource)) {
        return TileEntity.getTileEntity(x, y, z, this.blockSource)["data"][value] = data
      }
    };
    public getBlockByHeight(height, id): int {
      for (let i = 1; i < height; i++) {
        if (this.getBlock(this.x, this.y + i, this.z, id)) {
          return i;
        }
      }
      return 0;
    }
};

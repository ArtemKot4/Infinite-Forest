
class FBlock {
    constructor(public id: string, data) {
        IDRegistry.genBlockID(id);
        Block.createBlock(
            id,
            data, data && data[0].data ? data[0].data : null
          );
        
    };
    public onUse(func: (coords, item, block, player, region: BlockSource) => void) {
        Block.registerClickFunction(this.id, (coords, item, block, player) => {
            const region = BlockSource.getDefaultForActor(player);
            func(coords, item, block, player, region)
        })
    }
}
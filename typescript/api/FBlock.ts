class FBlock {
    constructor(public id: string, data: Block.BlockVariation[]) {
        IDRegistry.genBlockID(id);
        Block.createBlock(
            id,
            data
          );
        
    };
    public onUse(func: (coords, item, block, player, region: BlockSource) => void) {
        Block.registerClickFunction(this.id, (coords, item, block, player) => {
            const region = BlockSource.getDefaultForActor(player);
            func(coords, item, block, player, region)
        })
    }
}
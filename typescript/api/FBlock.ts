
class FBlock {
    constructor(public id: string, data) {
        IDRegistry.genBlockID(id);
        Block.createBlock(
            id,
            data, data && data[0].data ? data[0].data : null
          );
        
    };
    public static createWithRotation(id, data) {
        IDRegistry.genBlockID(id);
        Block.createBlockWithRotation(
            id,
            data, data && data[0].data ? data[0].data : null
          );
    };

    public static destroyByMessage(message, blockSource: BlockSource, that): void {
       return ( blockSource.destroyBlock(that.x, that.y, that.z, true),
        Particles.addParticle(EParticleType.CRIT, that.x, that.y, that.z, 0.03, 0.1, 0.03),
        Game.tipMessage(Native.Color.RED + Translation.translate(message))
       )
      }
    public onUse(func: (coords, item, block, player, region: BlockSource) => void) {
        Block.registerClickFunction(this.id, (coords, item, block, player) => {
            const region = BlockSource.getDefaultForActor(player);
            func(coords, item, block, player, region)
        })
    }
}
class IceBlock extends FBlock {
    public static specialType = Block.createSpecialType({
        explosionres: 0.5,
        lightopacity: 1,
        destroytime: .4,
        renderlayer: 1,
        sound: "glass"
    })
    constructor(id: string, data: Block.BlockVariation[], type: string | Block.SpecialType = IceBlock.specialType) {
        super(id, data, type);
        Block.setRandomTickCallback(this.getID(), IceBlock.melt);
        this.create();
    };
    public static melt(x: number, y: number, z: number, id: number, data: number, region: BlockSource) {
        alert("!")
       if(region.getLightLevel(x, y + 1, z) === 0 || y >= 130) return;
       region.setBlock(x, y, z, VanillaBlockID.flowing_water, 0);
       return;
    };
};

enum EIceBlock {
    
}
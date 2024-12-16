class IceFlower extends BlockPlant {
    constructor() {
        super("ice_flower", [{
            inCreative: true,
            name: "block.infinite_forest.ice_flower",
            texture: [["ice_flower", 0]]
        }])
    };

    public getLightLevel(): number {
        return 4;
    };

    public getBiomeState(): EBiomeState {
        return EBiomeState.COLD;
    };

}
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

    public onDestroyStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number) {
        if(Curse.has("cold")) {
            Block.setDestroyTime(block.id, (20 * 60) * 60);
            BlockRegistry.setSoundType(block.id, "glass");
        } else {
            Block.setDestroyTime(block.id, 1);
            BlockRegistry.setSoundType(block.id, "grass");
        };
    };

    public onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void {
        EffectList.WINTER.init(Player.getLocal(), 50);
    };

    public getDestroyTime(): number {
        return 20;
    }

}
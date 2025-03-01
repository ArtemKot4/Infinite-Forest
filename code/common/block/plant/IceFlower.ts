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
            NativeBlock.setSoundType(block.id, "glass");
        } else {
            Block.setDestroyTime(block.id, 1);
            NativeBlock.setSoundType(block.id, "grass");
        };
    };

    public onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void {
        Network.sendToServer("packet.infinite_forest.ice_flower.winter_effect_if_valid_condition", {
            coords
        });
        return;
    };

    public getDestroyTime(): number {
        return 20;
    };

};

Network.addServerPacket("packet.infinite_forest.ice_flower.winter_effect_if_valid_condition", (client, data: { coords: Callback.ItemUseCoordinates }) => {
    const blockSource = BlockSource.getDefaultForActor(client.getPlayerUid());
    const blockID = blockSource.getBlockID(data.coords.x, data.coords.y, data.coords.z);
    
    if(blockID === BlockList.ICE_FLOWER.id) {
        EffectList.WINTER.init(client.getPlayerUid(), 50);
    };
});
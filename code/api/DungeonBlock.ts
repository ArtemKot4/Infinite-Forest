class DungeonBlock extends IceBlock {
    protected static list: int[] = [];
    protected static destroyBlockStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number) {
        if(ColdCurse.has(player)) {
            Game.prevent();
        };
    };
    static {
        Callback.addCallback("DestroyBlockStart", DungeonBlock.destroyBlockStart);
    }
};

enum EDungeonBlock {
    
}
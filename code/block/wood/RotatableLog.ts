class RotatableLog extends BlockForest {
    constructor(id: string) {
        const upperTexture = id + "_top";
        const sideTexture = id + "_side";
        
        super(id, [{
            inCreative: true,
            name: "block.infinite_forest." + id,
            texture: [[upperTexture, 0], [upperTexture, 0], [sideTexture, 0], [sideTexture, 0], [sideTexture, 0], [sideTexture, 0]]      
        },
        {
            texture: [[sideTexture, 0], [sideTexture, 0], [upperTexture, 0], [upperTexture, 0], [sideTexture, 0], [sideTexture, 0]]
        },
        {
            texture: [[sideTexture, 0], [sideTexture, 0], [sideTexture, 0], [sideTexture, 0], [upperTexture, 0], [upperTexture, 0]] 
        }]);

    };

    public override onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        let data = 0;
        
        switch(coords.side) {
            case 5:
                data = 2;
                break;
            case 4:
                data = 2;
                break;
            case 3:
                data = 1;
                break;
            case 2:
                data = 1;
                break;
        };

        region.setBlock(coords.x, coords.y, coords.z, this.id, data);
    }
    public override getSoundType(): Block.Sound {
        return "wood";
    };
}
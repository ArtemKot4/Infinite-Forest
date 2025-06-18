class SparklingRoots extends BasicBlock implements IPlaceCallback {
    public constructor() {
        super("sparkling_roots", [{
            name: "block.infinite_forest.sparkling_roots",
            texture: [["sparkling_roots", 0]],
            inCreative: true
        }]);

        Block.setShape(this.id,  1/8, 0, 1/8, 7/8, 1, 7/8, 0);
        // Block.setShape(this.id, 1/8, 1/8, 0, 7/8, 7/8, 8, 1);
        // Block.setShape(this.id, 7/8, 1/8, 1, 7/8, 1/8, 2);
    }

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
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

        region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, this.id, data);
    }

    public getSoundType(): Block.Sound {
        return "grass";
    }
}
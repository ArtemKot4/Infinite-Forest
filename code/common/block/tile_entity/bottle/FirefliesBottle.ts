class FirefliesBottle extends BasicBlock implements IPlaceCallback, IBlockModel {
    public constructor() {
        super("fireflies_bottle", [{
            name: "block.infinite_forest.fireflies_bottle",
            texture: [["forest_bottle", 0]],
            inCreative: true
        }]);
    };

    public getModel(): BlockModel | BlockModel[] {
        return new BlockModel(modelsdir, "block/bottle", "forest_bottle");
    };

    public override getLightLevel(): number {
        return 10;
    };

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        let color = ParticleHelper.getRandomGlowworm();

        if(item.extra) {
            color = item.extra.getInt("color", color);
        };

        region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockList.FIREFLIES_BOTTLE.id, 0);

        Bottle.addTile(
            coords.relative.x, 
            coords.relative.y + 1, 
            coords.relative.z, 
            BlockSource.getDefaultForActor(player), 
            color
        );

        return;
    };

    public override getDrop(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[] {
        const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region) as TileEntity & FirefliesBottleTile;

        let extra = null;

        if(tile && tile.data.color) {
            extra = new ItemExtraData();
            extra.putInt("color", tile.data.color);
        };

        return [[id, 1, data, extra]];
    };

    public override getTileEntity(): CommonTileEntity {
        return new FirefliesBottleTile();
    };

    public override getSoundType(): Block.Sound {
        return "glass";
    };
};
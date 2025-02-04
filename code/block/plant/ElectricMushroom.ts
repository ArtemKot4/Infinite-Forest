class ElectricMushroomTile extends TileEntityBase {
    public override clientTick() {
        if(World.getThreadTime() % 5 === 0) {
            ParticleHelper.spawnElectric(this.x + 0.5, this.y + 0.4, this.z + 0.5);
        };
    };
}

class ElectricMushroom extends BlockPlant {
    public constructor() {
        super("electric_mushroom", [{
            inCreative: true,
            name: "block.infinite_forest.electric_mushroom",
            texture: [["electric_mushroom", 0]]
        }]);
    };

    public static dangerMessage(player: number) {
        return Utils.actionbarMessage(player, Translation.translate("message.infinite_forest.electric_danger"))
    };

    public static damage(player: number, damage: number = 5) {
        Entity.damageEntity(player, damage);
        this.dangerMessage(player);
    };

    public override onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        ElectricMushroom.damage(player);
    };

    public override onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void {
        const player = Player.getLocal();

        GameController.attack(player);
        ElectricMushroom.dangerMessage(player);
    };

    public override getTileEntity(): TileEntityBase {
        return new ElectricMushroomTile();
    };
};

class BlueMushroomBlock extends BlockForest {
    public constructor() {
        super("blue_mushroom_block", [{
            name: "block.infinite_forest.blue_mushroom_block",
            texture: [["mushroom_block_skin_blue", 0]],
            inCreative: true
        }]);
    };

    public override getSoundType(): Block.Sound {
        return "cloth";
    };

    public override getDestroyTime(): number {
        return 20;
    };

    public override getCreativeGroup(): string {
        return "nature";
    };

    public override getDrop(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        if (ToolAPI.isAxe(item.id) && Math.random() < 0.25) {
            return [[BlockList.ELECTRIC_MUSHROOM.id, 1, 0]];
        };
        return [[0, 0, 0]];
    };
};

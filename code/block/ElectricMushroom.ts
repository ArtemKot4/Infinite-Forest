class ElectricMushroomTile extends TileEntityBase {
    public override clientTick() {
        spawnElectric(this.x + 0.5, this.y + 0.4, this.z + 0.5);
    };
}

class ElectricMushroom extends BlockPlant {
    constructor() {
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

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        ElectricMushroom.damage(player);
    };

    public onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void {
        const player = Player.getLocal();

        GameController.attack(player);
        ElectricMushroom.dangerMessage(player);
    };

    public getTileEntity(): TileEntityBase {
        return new ElectricMushroomTile();
    };
};


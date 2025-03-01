abstract class TransferCrystal extends BasicItem implements ItemUseCallback {
    public allowDimensions: number[] = [];
    public provideDimension: number;

    public constructor(stringID: string, dimensionFrom: number, dimensionTo: number) {
        super(stringID, { name: stringID, meta: 0 }, {
            stack: 1
        });

        this.allowDimensions.push(dimensionFrom);
        this.provideDimension = dimensionTo;
    };

    public isExplodable(): boolean {
        return false;
    };

    public isShouldDespawn(): boolean {
        return false;
    };

    public isFireResistant(): boolean {
        return true;
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        const dimension = Entity.getDimension(player);

        if(this.allowDimensions.includes(dimension)) {
            Dimensions.transfer(player, this.provideDimension);
        };
    };
};

class BlueCrystal extends TransferCrystal {
    public constructor() {
        super("blue_crystal", EDimension.OVERWORLD, EDimension.INFINITE_FOREST.id);
    };

    public getName(): string {
        return "item.infinite_forest.blue_crystal";
    };
};

class OrangeCrystal extends TransferCrystal {
    public constructor() {
        super("orange_crystal", EDimension.INFINITE_FOREST.id, EDimension.OVERWORLD);
    };

    public getName(): string {
        return "item.infinite_forest.orange_crystal";
    };
};

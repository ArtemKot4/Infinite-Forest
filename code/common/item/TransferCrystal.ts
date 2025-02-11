abstract class TransferCrystal extends ItemForest {
    public allowDimensions: number[] = [];
    public provideDimension: number;

    public constructor(stringID: string, dimensionFrom: number, dimensionTo: number) {
        super(stringID, { name: stringID, meta: 0 }, 1);

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
        super("blue_crystal", EDimension.OVERWORLD, InfiniteForest.id);
    };
};

class OrangeCrystal extends TransferCrystal {
    public constructor() {
        super("orange_crystal", InfiniteForest.id, EDimension.OVERWORLD);
    };
};

abstract class TransferCrystal extends BasicItem implements IItemUseCallback {
    public allowDimensions: number[] = [];
    public provideDimension: number;

    public constructor(stringID: string, dimensionFrom: number, dimensionTo: number) {
        super(stringID, { name: stringID, meta: 0 }, {
            stack: 1
        });

        this.allowDimensions.push(dimensionFrom);
        this.provideDimension = dimensionTo;
    }

    public isExplodable(): boolean {
        return false;
    }

    public isShouldDespawn(): boolean {
        return false;
    }

    public isFireResistant(): boolean {
        return true;
    }

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        const dimension = Entity.getDimension(player);

        if(this.allowDimensions.includes(dimension)) {
            Dimensions.transfer(player, this.provideDimension);
        }
    }
}

class BlueCrystal extends TransferCrystal {
    public constructor() {
        super("blue_crystal", EDimension.OVERWORLD, EDimension.INFINITE_FOREST.id);
    }

    public getName(): string {
        return "item.infinite_forest.blue_crystal";
    }

    @SubscribeEvent
    public onEntityAdded(entityUid: number): void {
        if(Entity.getType(entityUid) == EEntityType.ITEM) {
            const blockSource = BlockSource.getDefaultForActor(entityUid);
            const item = Entity.getDroppedItem(entityUid);
            const pos = Entity.getPosition(entityUid);
            if(item.id == ItemList.BLUE_CRYSTAL.id) {
                Updatable.addUpdatable({
                    update() {
                        if(!Entity.isExist(entityUid)) {
                            this.remove = true;
                        }
                        if(blockSource.getBlockID(pos.x, pos.y - 1, pos.z) == VanillaBlockID.fire) {
                            SkyRift.create(pos.x, pos.y, pos.z, blockSource.getDimension());
                            Entity.remove(entityUid);
                            blockSource.explode(pos.x, pos.y, pos.z, 1, false);
                        }   
                    }
                })
            }
        }
    }
}

class OrangeCrystal extends TransferCrystal {
    public constructor() {
        super("orange_crystal", EDimension.INFINITE_FOREST.id, EDimension.OVERWORLD);
    }

    public getName(): string {
        return "item.infinite_forest.orange_crystal";
    }
}
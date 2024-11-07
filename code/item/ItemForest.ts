type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];

interface IItemTextureDescription {
  name: string |  itemTextureAnimated,
  meta: number
};

class ItemForest implements ItemBehavior, ItemHandComponent {

    public static itemOnHandFuncs: Map<number, (item: ItemStack) => void> = new Map();

    public maxStack: number = 64;
    public texture: IItemTextureDescription;

    public id: number;
    public stringID: string;

    public constructor(stringID: string, texture: IItemTextureDescription, stack: number = 64) {
        this.id = IDRegistry.genItemID(stringID);
 
        this.stringID = stringID;
        this.maxStack = stack;
        this.texture = texture;

        this.create();
    };

    public getMaxStack(): number {
        return this.maxStack;
    };

    public getStringID(): string {
        return this.stringID;
    };

    public getID(): number {
        return this.id
    };

    public getItemCategory(): ItemCategory {
        return ItemCategory.ITEMS;
    };

    public isExplodable(): boolean {
        return true;
    };

    public isFireResistant(): boolean {
        return false;
    };

    public isShouldDespawn(): boolean {
        return true;
    }

    public isGlint(): boolean {
        return false;
    };

    public getTexture(): IItemTextureDescription {
        return this.texture;
    };

    public inCreative(): boolean {
         return true;
    }

    public create(): void {
        const textureData = this.getTexture();

        const itemTexture = Object.assign(
             textureData,
             textureData.name instanceof Array && {texture: textureData.name[0]}
        );

        Item.createItem(this.stringID, `item.infinite_forest.${this.stringID}`,
          itemTexture as Item.TextureData,
             {
                stack: this.getMaxStack(),
                isTech: !this.inCreative(),
                category: this.getItemCategory()
             });

        if(textureData.name instanceof Array) { 
          const [texture, frames, interval] = textureData.name;

          IAHelper.makeAdvancedAnim(this.id, 
              texture, 
              interval,
              frames instanceof Array ? 
              frames : range(0, frames));
        };

        if(this.isFireResistant()) {
            Item.setFireResistant(this.id, true);
        };

        if(this.isExplodable()) {
            Item.setExplodable(this.id, true);
        };

        if(this.isShouldDespawn()) {
            Item.setShouldDespawn(this.id, true);
        };

        if(this.isGlint()) {
            Item.setGlint(this.id, true);
        };

        ItemRegistry.registerItemFuncs(this.id, this);

        if('onHand' in this) {
           ItemForest.itemOnHandFuncs.set(this.id, this.onHand);
        };

    };

    public onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;

    public onNoTargetUse?(item: ItemStack, player: number): void;

    public onUsingReleased?(item: ItemStack, ticks: number, player: number): void;

    public onUsingComplete?(item: ItemStack, player: number): void;

    public onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;

    public onHand?(item: ItemStack): void; 
    
};

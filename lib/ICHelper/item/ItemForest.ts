type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];

interface IItemTextureDescription {
  name: string |  itemTextureAnimated,
  meta: number
};

interface IconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData
};

interface NoTargetUseCallback {
    onNoTargetUse(item: ItemInstance, player: number): void;
};

interface ItemUsingReleasedCallback {
    onUsingReleased(item: ItemInstance, ticks: number, player: number): void;
};

interface onUsingCompleteCallback {
    onUsingComplete(item: ItemInstance, player: number): void;
};

interface ItemUseCallback {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void
};

interface NameOverrideCallback {
    onNameOverride(item: ItemInstance, translation: string, name: string): void | string;
};

interface IExplodableItem {
    isExplodable(): boolean;
};

interface IFireRestistantItem {
    isFireResistant(): boolean;
};

interface IShouldDespawnItem {
    isShouldDespawn(): boolean;
};

interface IGlintItem {
    isGlint(): boolean;
};

class ItemForest {
    public static handFunctions: Map<number, (item: ItemInstance, playerUid: number) => void> = new Map();

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

    public getTexture(): IItemTextureDescription {
        return this.texture;
    };

    public inCreative(): boolean {
        return true;
    };

    public getTags?(): string[] {
        return null;
    };

    public static setFunctions(instance: { id: number, [key: string]: any }) {
        if("isFireResistant" in instance) {
            Item.setFireResistant(instance.id, true);
        };

        if("isExplodable" in instance) {
            Item.setExplodable(instance.id, true);
        };

        if("isShouldDespawn" in instance) {
            Item.setShouldDespawn(instance.id, true);
        };

        if("isGlint" in instance) {
            Item.setGlint(instance.id, true);
        };

        if('onIconOverride' in instance) {
            Item.registerIconOverrideFunction(instance.id, instance.onIconOverride);
        };

        if('onNoTargetUse' in instance) {
            Item.registerNoTargetUseFunction(instance.id, instance.onNoTargetUse);
        };

        if('onUsingReleased' in instance) {
            Item.registerUsingReleasedFunction(instance.id, instance.onUsingReleased);
        };

        if('onUsingComplete' in instance) {
            Item.registerUsingCompleteFunction(instance.id, instance.onUsingComplete);
        };

        if('onItemUse' in instance) {
            Item.registerUseFunction(instance.id, instance.onItemUse);
        };

        if('onNameOverride' in instance) {
            Item.registerNameOverrideFunction(instance.id, instance.onNameOverride);
        };

        if('onHand' in instance) {
            ItemForest.handFunctions.set(instance.id, (instance as ItemHandComponent).onHand);
        };

        if("getItemCategory" in instance) {
            Item.setCategory(instance.id, instance.getItemCategory())
        }
    };

    public create(): void {
        const tags = this.getTags();

        if(tags) {
            TagRegistry.addCommonObject("items", this.id, tags);
        };

        const textureData = this.getTexture();

        const itemTexture = Object.assign(
            textureData,
            textureData.name instanceof Array && {texture: textureData.name[0]}
        );

        Item.createItem(this.stringID, `item.infinite_forest.${this.stringID}`, itemTexture as Item.TextureData,
            {
                stack: this.getMaxStack(),
                isTech: !this.inCreative(),
                category: this.getItemCategory()
            }
        );

        if(textureData.name instanceof Array) { 
            const [texture, frames, interval] = textureData.name;

            IAHelper.makeAdvancedAnim(this.id, 
                texture, 
                interval,
                frames instanceof Array ? frames : Utils.range(0, frames)
            );
        };

        ItemForest.setFunctions(this);
    };

};

Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(World.getThreadTime() % 8 === 0) {

        const actor = new PlayerActor(playerUid);
        const selectedItemInstance = actor.getInventorySlot(actor.getSelectedSlot());
        const carriedItemInstance = Entity.getCarriedItem(playerUid);

        const handFunction = ItemForest.handFunctions.get(selectedItemInstance.id);

        if(selectedItemInstance.id == carriedItemInstance.id && handFunction !== undefined) {
            return handFunction(selectedItemInstance, playerUid);
        };
    };
});
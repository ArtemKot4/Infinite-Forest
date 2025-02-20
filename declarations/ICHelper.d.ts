/// <reference path="C:\Users\Пользователь\Desktop\Игры\HORIZON MODDING KERNEL\Inner Core Mod Toolchain\toolchain\toolchain\declarations\core-engine.d.ts" /> 
/// <reference path="C:\Users\Пользователь\Desktop\Игры\HORIZON MODDING KERNEL\Inner Core Mod Toolchain\toolchain-infinite-forest\declarations\BlockEngine.d.ts" /> 
declare namespace MathHelper {
    function randomFrom<T>(...elements: T[]): T;
    function randomFromArray<T>(array: T[]): T;
    function radian(gradus: number): number;
    function randomInt(min: number, max: number): number;
}

declare namespace Utils {
    function setEmptyBlockCollision(id: number): void;
    function getBlockTags(id: number): string[];
    function getItemTags(id: number): string[];
    function getDimensionTags(id: number): string[];
    function actionbarMessage(player: number, message: string): void;
    function isCreativePlayer(player: number): boolean;
    function range(min: number, max: number, number?: number): number[];
    function parseBlockID(id: string): number;
    function parseItemID(id: string): number;
    function parseID(id: string): number;
}

declare namespace com.zhekasmirnov.innercore.api.NativeBlock {
    function setSolid(id: number, solid: boolean): void;
    function setRenderAllFaces(id: number, render: boolean): void;
    function setRenderType(id: number, type: number): void;
    function setRenderLayer(id: number, layer: number): void;
    function setLightLevel(id: number, level: number): void;
    function setLightOpacity(id: number, opacity: number): void;
    function setExplosionResistance(id: number, resistance: number): void;
    function setFriction(id: number, friction: number): void;
    function setTranslucency(id: number, translucency: number): void;
    function setSoundType(id: number, type: Block.Sound): void;
    function setMapColor(id: number, color: number): void;
    function setBlockColorSource(id: number, source: Block.ColorSource): void;
    function setMaterialBase(id: number, base_id: number): void;
}

declare enum EDestroyLevel {
    HAND = 0,
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    OBSIDIAN = 4
}

declare abstract class BlockBush extends BlockPlant implements IClickCallback, IRandomTickCallback {
    public berryID: number;
    public getMaxStage(): number;
    constructor(stringID: string, variationList: Block.BlockVariation[], berryID: number);
    abstract getChance(): number;
    abstract getCount(): [min: number, max: number];
    public onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
    public onClick(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
}

declare interface IDestroyCallback {
    onDestroy(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void;
}

declare interface IDestroyContinueCallback {
    onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void;
}

declare interface IDestroyStartCallback {
    onDestroyStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void;
}

declare interface IPlaceCallback {
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource): Vector | void;
}

declare interface INeighbourChangeCallback {
    onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void;
}

declare interface IEntityInsideCallback {
    onEntityInside(blockCoords: Vector, block: Tile, entity: number): void;
}

declare interface IEntityStepOnCallback {
    onEntityStepOn(coords: Vector, block: Tile, entity: number): void;
}

declare interface IRandomTickCallback {
    onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
}

declare interface IAnimateTickCallback {
    onAnimateTick(x: number, y: number, z: number, id: number, data: number): void;
}

declare interface IClickCallback {
    onClick(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
}

declare class BlockForest {
    public static destroyContinueFunctions: Record<number, Callback.DestroyBlockContinueFunction>;
    public static destroyStartFunctions: Record<number, Callback.DestroyBlockFunction>;
    public static destroyFunctions: Record<number, Callback.DestroyBlockFunction>;
    public readonly variationList: Block.BlockVariation[];
    public readonly id: number;
    public readonly stringID: string;
    constructor(stringID: string, variationList: Block.BlockVariation[]);
    public canRotate(): boolean;
    public build(): void;
    public setModel(model: BlockModel | RenderMesh, data: number): this;
    public getID(): number;
    public getTags?(): string[];
    public getDrop?(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[];
    public getDestroyTime?(): number;
    public getSoundType?(): Block.Sound;
    public getFriction?(): number;
    public getLightLevel?(): number;
    public getLightOpacity?(): number;
    public getExplosionResistance?(): number;
    public getMapColor?(): number;
    public getMaterial?(): string;
    public getRenderLayer?(): number;
    public getRenderType?(): number;
    public getTranslurency?(): number;
    public getDestroyLevel(): EDestroyLevel;
    public getCreativeGroup?(): string;
    public getTileEntity?(): TileEntityBase;
    public setTileEntity(tileEntity: TileEntityBase): void;
    public isSolid?(): boolean;
    public static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource): void;
}

declare class BlockModel {
    protected readonly mesh: RenderMesh;
    protected readonly data: number;
    constructor(model: string, texture?: {name: string, meta: number} | string, data?: number);
    public getRenderMesh(): RenderMesh;
    public scale(x: number, y: number, z: number): this;
    public translate(x: number, y: number, z: number): this;
    public rotate(x: number, y: number, z: number): this;
    public getBlockData(): number;
}

declare interface IBlockModel {
    getModel?(): RenderMesh | RenderMesh[] | BlockModel | BlockModel[];
}

declare abstract class BlockPlant extends BlockForest implements INeighbourChangeCallback, IPlaceCallback {
    public static allowedBlockList: number[];
    public constructor(stringID: string, variationList: Block.BlockVariation[]);
    public override getCreativeGroup(): string;
    public onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void;
    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector;
    public override isSolid(): boolean;
    public override getLightOpacity(): number;
    public override getDestroyTime(): number;
    public override getSoundType(): Block.Sound;
    public override getRenderType(): number;
}

declare class Planks extends BlockForest {
    public log_id: string;
    public bark_id: string;
    public hewn_id: string;
    constructor(id: string, log_id: string, bark_id: string, hewn_id: string);
}

declare class RotatableLog extends BlockForest implements IPlaceCallback {
    constructor(id: string, texture?: string);
    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector;
    public override getSoundType(): Block.Sound;
    public override getDrop(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[];
}

declare class Bark extends RotatableLog {
    constructor(id: string, texture: string);
}

declare class Log extends RotatableLog implements IClickCallback {
    public hewn_id: string;
    constructor(id: string, hewn_id: string);
    public onClick(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
}

declare class Hewn extends RotatableLog {
    constructor(id: string);
}

declare interface ItemHandComponent {
    onHand?(item: ItemStack, player_uid: number): void;
}

declare type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];

declare interface IItemTextureDescription {
  name: string | itemTextureAnimated;
  meta: number;
}

declare interface IconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData;
}

declare interface NoTargetUseCallback {
    onNoTargetUse(item: ItemInstance, player: number): void;
}

declare interface ItemUsingReleasedCallback {
    onUsingReleased(item: ItemInstance, ticks: number, player: number): void;
}

declare interface onUsingCompleteCallback {
    onUsingComplete(item: ItemInstance, player: number): void;
}

declare interface ItemUseCallback {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
}

declare interface NameOverrideCallback {
    onNameOverride(item: ItemInstance, translation: string, name: string): void | string;
}

declare interface IExplodableItem {
    isExplodable(): boolean;
}

declare interface IFireRestistantItem {
    isFireResistant(): boolean;
}

declare interface IShouldDespawnItem {
    isShouldDespawn(): boolean;
}

declare interface IGlintItem {
    isGlint(): boolean;
}

declare class ItemForest {
    public static handFunctions: Map<number, (item: ItemInstance, playerUid: number) => void>;
    public maxStack: number;
    public texture: IItemTextureDescription;
    public id: number;
    public stringID: string;
    constructor(stringID: string, texture: IItemTextureDescription, stack?: number);
    public getMaxStack(): number;
    public getStringID(): string;
    public getID(): number;
    public getItemCategory(): ItemCategory;
    public getTexture(): IItemTextureDescription;
    public inCreative(): boolean;
    public getTags?(): string[];
    public static setFunctions(instance: { id: number, [key: string]: any }): void;
    public create(): void;
}

declare namespace RenderHelper {
    function generateMesh(model: string, params?: RenderMesh.ImportParams, rotate?: number[]): RenderMesh;
}

declare namespace UIHelper {
    function separateText(text: string, line_size?: number): string;
}

declare class Keyboard {
    public context: any;
    public func: (text: string) => void;
    public default_string: string;
    constructor(default_string: string);
    public getText(func: (text: string) => void): Keyboard;
    public open(): void;
}

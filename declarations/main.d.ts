declare namespace Utils {
    const NativeBlock: typeof com.zhekasmirnov.innercore.api.NativeBlock;
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
type NativeRendererTransform = com.zhekasmirnov.innercore.api.NativeRenderer.Transform;
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
declare namespace com.zhekasmirnov.innercore.api.NativeAPI {
    function getDifficulty(): EGameDifficulty;
    function setDifficulty(difficulty: EGameDifficulty): any;
    function resetCloudColor(): void;
    function resetFogColor(): void;
    function resetFogDistance(): void;
    function resetSkyColor(): void;
    function resetSunsetColor(): void;
    function resetUnderwaterFogColor(): void;
    function resetUnderwaterFogDistance(): void;
    function setFogColor(r: number, g: number, b: number): void;
    function setSkyColor(r: number, g: number, b: number): void;
    function setSunsetColor(r: number, g: number, b: number): void;
    function setUnderwaterFogColor(r: number, g: number, b: number): void;
    function setUnderwaterFogDistance(r: number, g: number, b: number): void;
    function setFogDistance(r: number, g: number, b: number): void;
    function setCloudColor(r: number, g: number, b: number): void;
}
declare enum EDestroyLevel {
    HAND = 0,
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    OBSIDIAN = 4
}
declare namespace ToolAPI {
    function isAxe(item: number): boolean;
    function isPickaxe(item: number): boolean;
}
declare namespace Game {
    function actionbarMessage(message: string): void;
}
declare namespace MathHelper {
    function randomFrom<T>(...elements: T[]): T;
    function randomFromArray<T>(array: T[]): T;
    function radian(gradus: number): number;
    function randomInt(min: number, max: number): number;
}
declare namespace RenderHelper {
    function generateMesh(dir: string, model: string, params?: RenderMesh.ImportParams, rotate?: number[]): RenderMesh;
}
declare class RenderSide<T extends string | RenderMesh> {
    model: T;
    importParams: RenderMesh.ImportParams;
    readonly list: RenderMesh[];
    constructor(dir: string, model: RenderMesh);
    constructor(dir: string, model: string, importParams?: RenderMesh.ImportParams);
    getWithData(data: number): RenderMesh;
    getForTile(tile_entity: TileEntity.TileEntityPrototype): RenderMesh;
}
declare class BlockAnimation {
    coords: Vector;
    tile_entity?: TileEntity.TileEntityPrototype;
    animation?: Animation.Base;
    constructor(coords: Vector, tile_entity?: TileEntity.TileEntityPrototype);
    load(): void;
    describe(mesh: RenderMesh | RenderSide<string>, texture: string, scale?: number, material?: string): void;
    rotate(x: number, y: number, z: number): NativeRendererTransform;
    scale(x: number, y: number, z: number): NativeRendererTransform;
    setPos(x: number, y: number, z: number): void;
    refresh(): void;
    destroy(): void;
}
declare class Keyboard {
    context: any;
    func: (text: string) => void;
    default_string: string;
    constructor(default_string: string);
    getText(func: (text: string) => void): Keyboard;
    open(): void;
}
declare namespace UIHelper {
    function separateText(text: string, line_size?: number): string;
}
declare namespace WorldSaves {
    const defaultData: {
        players: {};
    };
    let data: {
        players: Record<number, typeof defaultData.players & Scriptable>;
    } & Scriptable;
}
declare class Vector3 {
    x: number;
    y: number;
    z: number;
    static readonly DOWN: Vector3;
    static readonly UP: Vector3;
    static readonly NORTH: Vector3;
    static readonly SOUTH: Vector3;
    static readonly EAST: Vector3;
    static readonly WEST: Vector3;
    constructor(x: number, y: number, z: number);
    copy(): Vector3;
    equals(vector: Vector3): boolean;
}
interface ICommandParams {
    /**
     * Entity list got from native format:
     * @s caller
     * @p caller
     * @a all players
     * @e all entities
     * Must be registered in constructor.
     */
    initiator?: {
        entities: number[] | [];
        players: number[] | [];
        caller: number;
    };
}
type ArgumentTypes = "string" | "number" | "boolean" | "any";
declare abstract class Command {
    static list: Record<string, Command>;
    caller: string;
    arguments: Record<string, ArgumentTypes>;
    require_count: number;
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
}
/**
 * Class to create your client side commands.
 */
declare abstract class ClientCommand<T extends Object> extends Command {
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    /**
     * Method, works after player send a command in chat in client side.
     * @param data your arguments from client
     */
    abstract onCall(data: T): void;
}
/**
 * Class to create your server & client side commands
 */
declare abstract class ServerCommand<T extends ICommandParams> extends Command {
    static initiator_chars: string[];
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    /**
     * Method, works on client. If you use it, you must send it packet from server.
     * @param data data from server
     * @returns void;
     */
    protected onClient(data: T): void;
    /**
     * Method, works after player send a command in chat in server side.
     * @param client client, that send your command in game
     * @param data your arguments from client
     */
    abstract onServer(client: NetworkClient, data: T): void;
    /**
     * Method to parse arguments: initiator -> @s, @p, @a, @e.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     * @returns
     */
    protected getParsedData(client: NetworkClient, data: T): T;
    /**
     * Method that create packets;
     */
    protected buildPacket(): void;
    /**
     * Method to call client function. Sends packet to client.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     */
    protected sendToClient(client: NetworkClient, data: T): void;
    /**
     * Method, sends message to client.
     * @param client just NetworkClient from server side
     * @param message any string message
     */
    protected sendMessageToClient(client: NetworkClient, message: string): void;
    /**
     * Method to call client function with all valid players.
     * @param data your arguments from client
     */
    protected sendToAllClients(data: T): void;
}
interface ITestCommand extends ICommandParams {
    "aboba": string;
}
declare class TestServerCommand extends ServerCommand<ITestCommand> {
    constructor();
    onServer(client: NetworkClient, data: ITestCommand): void;
}
declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor();
    constructor(instance: ItemInstance);
    constructor(id: number, count: number, data?: number, extra?: ItemExtraData);
    decrease(count?: number): void;
    increase(count?: number): void;
    equals(stack: ItemStack): boolean;
    getItemInstance(): ItemInstance;
    isEmpty(): boolean;
    clear(): void;
    getMaxStack(): number;
    getMaxDamage(): number;
    isNativeItem(): boolean;
    getStringID(): string;
    copy(): ItemStack;
}
interface ItemHandComponent {
    onHand?(item: ItemInstance, player_uid: number): void;
}
type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];
interface IItemTextureDescription {
    name: string | itemTextureAnimated;
    meta: number;
}
interface IconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData;
}
interface INoTargetUseCallback {
    onNoTargetUse(item: ItemStack, player: number): void;
}
interface ItemUsingReleasedCallback {
    onUsingReleased(item: ItemStack, ticks: number, player: number): void;
}
interface ItemUsingCompleteCallback {
    onUsingComplete(item: ItemStack, player: number): void;
}
interface ItemUseCallback {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
interface INameOverrideCallback {
    onNameOverride(item: ItemInstance, translation: string, name: string): void | string;
}
interface IExplodableItem {
    isExplodable(): boolean;
}
interface IFireRestistantItem {
    isFireResistant(): boolean;
}
interface IShouldDespawnItem {
    isShouldDespawn(): boolean;
}
interface IGlintItem {
    isGlint(): boolean;
}
type ItemParams = Item.ItemParams | Item.FoodParams | Item.ArmorParams;
declare class BasicItem<T extends Item.ItemParams = Item.ItemParams> {
    static handFunctions: Map<number, (item: ItemInstance, playerUid: number) => void>;
    maxStack: number;
    texture: IItemTextureDescription;
    id: number;
    stringID: string;
    constructor(stringID: string, texture: IItemTextureDescription, params?: T);
    getMaxStack(): number;
    getName(): string;
    getStringID(): string;
    getID(): number;
    getItemCategory(): EItemCategory;
    getTexture(): IItemTextureDescription;
    inCreative(): boolean;
    getTags?(): string[];
    isThrowable?(): boolean;
    getFood?(): number;
    static setFunctions(instance: (IconOverrideCallback | INoTargetUseCallback | ItemUsingReleasedCallback | ItemUsingCompleteCallback | ItemUseCallback | INameOverrideCallback | ItemHandComponent | BasicItem) & {
        id: number;
    }): void;
    create(params: ItemParams): void;
}
interface IBlockModel {
    getModel?(): RenderMesh | RenderMesh[] | BlockModel | BlockModel[];
}
declare class BlockModel {
    protected readonly mesh: RenderMesh;
    protected readonly data: number;
    constructor(dir: string, model: string, texture?: {
        name: string;
        meta: number;
    } | string, data?: number);
    getRenderMesh(): RenderMesh;
    scale(x: number, y: number, z: number): this;
    translate(x: number, y: number, z: number): this;
    rotate(x: number, y: number, z: number): this;
    getBlockData(): number;
}
interface IDestroyCallback {
    onDestroy(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void;
}
interface IDestroyContinueCallback {
    onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void;
}
interface IDestroyStartCallback {
    onDestroyStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void;
}
interface IPlaceCallback {
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;
}
interface INeighbourChangeCallback {
    onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void;
}
interface IEntityInsideCallback {
    onEntityInside(blockCoords: Vector, block: Tile, entity: number): void;
}
interface IEntityStepOnCallback {
    onEntityStepOn(coords: Vector, block: Tile, entity: number): void;
}
interface IRandomTickCallback {
    onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
}
interface IAnimateTickCallback {
    onAnimateTick(x: number, y: number, z: number, id: number, data: number): void;
}
interface IClickCallback {
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
declare class BasicBlock {
    static destroyContinueFunctions: Record<number, Callback.DestroyBlockContinueFunction>;
    static destroyStartFunctions: Record<number, Callback.DestroyBlockFunction>;
    static destroyFunctions: Record<number, Callback.DestroyBlockFunction>;
    readonly variationList: Block.BlockVariation[];
    readonly id: number;
    readonly stringID: string;
    constructor(stringID: string, variationList?: Block.BlockVariation[]);
    canRotate(): boolean;
    build(): void;
    setModel(model: BlockModel | RenderMesh, data: number): this;
    getID(): number;
    getTags?(): string[];
    getDrop?(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
    getDestroyTime?(): number;
    getSoundType?(): Block.Sound;
    getFriction?(): number;
    getLightLevel?(): number;
    getLightOpacity?(): number;
    getExplosionResistance?(): number;
    getMapColor?(): number;
    getMaterial?(): string;
    getRenderLayer?(): number;
    getRenderType?(): number;
    getTranslucency?(): number;
    getDestroyLevel(): EDestroyLevel;
    getCreativeGroup?(): string;
    getTileEntity?(): CommonTileEntity;
    isSolid?(): boolean;
    static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource): void;
}
declare abstract class BlockPlant extends BasicBlock implements INeighbourChangeCallback, IPlaceCallback {
    static allowedBlockList: number[];
    constructor(stringID: string, variationList: Block.BlockVariation[]);
    getCreativeGroup(): string;
    onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector;
    isSolid(): boolean;
    getLightOpacity(): number;
    getDestroyTime(): number;
    getSoundType(): Block.Sound;
    getRenderType(): number;
}
declare abstract class BlockBush extends BasicBlock implements IClickCallback, IRandomTickCallback {
    berryID: number;
    getMaxStage(): number;
    constructor(stringID: string, variationList: Block.BlockVariation[], berryID: number);
    abstract getChance(): number;
    abstract getCount(): [min: number, max: number];
    onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
declare class RotatableLog extends BasicBlock implements IPlaceCallback {
    constructor(id: string, texture?: string);
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector;
    getSoundType(): Block.Sound;
    getDrop(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
}
declare class Log extends RotatableLog implements IClickCallback {
    hewn_id: string;
    constructor(id: string, hewn_id: string);
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
declare class Bark extends RotatableLog {
    constructor(id: string, texture: string);
}
declare class Hewn extends RotatableLog {
    constructor(id: string);
}
declare class Planks extends BasicBlock {
    log_id: string;
    bark_id: string;
    hewn_id: string;
    constructor(id: string, log_id: string, bark_id: string, hewn_id: string);
}
/**
 * Decorator to create network event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */
declare function NetworkEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string): void;
/**
 * Decorator to create container event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */
declare function ContainerEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string): void;
declare abstract class LocalTileEntity implements TileEntity.LocalTileEntityPrototype {
    events: {
        [packetName: string]: (packetData: any, packetExtra: any) => void;
    };
    containerEvents?: {
        [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void;
    };
    eventNames: {
        network: string[];
        container: string[];
    };
    /**@deprecated */
    load(): void;
    /**@deprecated */
    unload(): void;
    /**@deprecated */
    tick(): void;
    onLoad(): void;
    onUnload(): void;
    onTick(): void;
    constructor();
}
/**Class to create tile entities in separated client server side formats.
 * @example
 * ```ts
 * class LocalExampleTile extends LocalTileEntity {
 *     @NetworkEvent
 *     public exampleMessagePacket(): void {
 *         Game.message("example");
 *         return;
 *     };
 *
 *     public onTick(): void {
 *         Game.message("tick work")
 *     };
 * };
 *
 * class ExampleTile extends CommonTileEntity {
 *     public getLocalTileEntity(): LocalTileEntity {
 *         return new LocalExampleTile();
 *     };
 *
 *     public onTick(): void {
 *         this.sendPacket("exampleMessagePacket", {});
 *     };
 * };
 *
 * class ExampleBlock extends BasicBlock {
 *     public constructor() {
 *         super("example_block");
 *     };
 *
 *     public override getTileEntity(): CommonTileEntity {
 *         return new ExampleTile();
 *     };
 * };
 * ```
 */
declare abstract class CommonTileEntity implements TileEntity {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly dimension: number;
    readonly blockID: number;
    readonly blockSource: BlockSource;
    readonly networkData: SyncedNetworkData;
    readonly networkEntity: NetworkEntity;
    readonly networkEntityType: NetworkEntityType;
    readonly networkEntityTypeName: string;
    data: Scriptable;
    defaultValues: Scriptable;
    container: ItemContainer | UI.Container;
    liquidStorage: LiquidRegistry.Storage;
    isLoaded: boolean;
    remove: boolean;
    noupdate: boolean;
    useNetworkItemContainer?: boolean;
    events: {
        [packetName: string]: (packetData: any, packetExtra: any) => void;
    };
    containerEvents?: {
        [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void;
    };
    client?: LocalTileEntity;
    eventNames: {
        network: string[];
        container: string[];
    };
    created(): void;
    /**@deprecated */
    init(): void;
    /**@deprecated */
    load(): void;
    /**@deprecated */
    unload(): void;
    /**@deprecated */
    update: () => void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void;
    /**@deprecated */
    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    redstone(params: Callback.RedstoneSignalParams): void;
    /**@deprecated */
    projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    /**@deprecated */
    destroy(): boolean | void;
    /**@deprecated */
    tick(): void;
    onInit(): void;
    onLoad(): void;
    onUnload(): void;
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean | void;
    onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    onProjectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    onDestroyTile(): boolean | void;
    onTick(): void;
    getGuiScreen(): Nullable<UI.IWindow>;
    getScreenByName(screenName?: string): Nullable<UI.IWindow>;
    onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean;
    requireMoreLiquid(liquid: string, amount: number): void;
    sendPacket: (name: string, data: object) => {};
    sendResponse: (packetName: string, someData: object) => {};
    selfDestroy(): void;
    getLocalTileEntity(): LocalTileEntity;
    constructor();
}
declare class PlayerUser {
    playerUid: number;
    readonly actor: PlayerActor;
    constructor(playerUid: number);
    getUid(): number;
    getDimension(): number;
    getGameMode(): number;
    addItemToInventory(item: ItemInstance): void;
    addItemToInventory(id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    getInventorySlot(slot: number): ItemStack;
    setInventorySlot(slot: number, item: ItemInstance): void;
    setInventorySlot(slot: number, id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    getArmor(slot: number): ItemStack;
    setArmor(slot: number, item: ItemInstance): void;
    setArmor(slot: number, id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    setRespawnCoords(x: number, y: number, z: number): void;
    setRespawnCoords(vector: Vector): void;
    spawnExpOrbs(x: number, y: number, z: number, value: number): void;
    spawnExpOrbs(vector: Vector, value: number): void;
    getPointer(): number;
    isValid(): boolean;
    getSelectedSlot(): number;
    setSelectedSlot(slot: number): void;
    getExperience(): number;
    setExperience(exp: number): void;
    addExperience(amount: number): void;
    getLevel(): number;
    setLevel(level: number): void;
    getExhaustion(): number;
    setExhaustion(value: number): void;
    getHunger(): number;
    setHunger(value: number): void;
    getSaturation(): number;
    setSaturation(value: number): void;
    getScore(): number;
    setScore(value: number): void;
    getItemUseDuration(): number;
    getItemUseIntervalProgress(): number;
    getItemUseStartupProgress(): number;
    isOperator(): boolean;
    setPlayerBooleanAbility(ability: EPlayerAbility, value: boolean): void;
    setPlayerFloatAbility(ability: EPlayerAbility, value: number): void;
    getPlayerBooleanAbility(ability: string): boolean;
    getPlayerFloatAbility(ability: string): number;
    canFly(): boolean;
    setCanFly(enabled: boolean): void;
    isFlying(): boolean;
    setFlying(enabled: boolean): void;
    getEffect(effect: EPotionEffect): Entity.EffectInstance;
    setEffect(effectId: EPotionEffect, effectData: number, effectTime: number, ambience?: boolean, particles?: boolean): void;
    getSneaking(): boolean;
    setSneaking(value: boolean): void;
    getName(): string;
    getCarriedItem(): ItemStack;
    decreaseCarriedItem(count: number): void;
    clearSlot(slot?: number): void;
    clearInventory(): void;
}
interface CustomGeneratorDescription {
    base?: string | number;
    buildVanillaSurfaces?: boolean;
    generateVanillaStructures?: boolean;
    modWorldgenDimension?: string | number;
    type?: string;
    biome?: number;
    layers?: Dimensions.TerrainLayerParams[];
}
declare abstract class Dimension {
    id: number;
    stringId: string;
    static generateChunkFunctions: Record<number, (chunkX: number, chunkZ: number, random: java.util.Random) => void>;
    static insideDimensionTransferFunctions: Record<number, (playerUid: number, from: number) => void>;
    static outsideDimensionTransferFunctions: Record<number, (playerUid: number, to: number) => void>;
    dimension: Dimensions.CustomDimension;
    biome: CustomBiome;
    layers: Dimensions.TerrainLayerParams[];
    constructor(id: number, stringId: string, biome?: CustomBiome);
    hasBedrockLayer(): boolean;
    addLayer(layer: Dimensions.TerrainLayerParams): void;
    getLayers?(): Dimensions.TerrainLayerParams[];
    getGenerator(): Dimensions.CustomGenerator;
    getTags(): string[];
    /**Specifies base generator, see CustomGenerator constructor for details. */
    getBase?(): string | number;
    modWorldgenDimension?(): string | number;
    getType?(): string;
    buildVanillaSurfaces(): boolean;
    generateCaves(): [caves: boolean, underwater_caves: boolean];
    generateVanillaStructures(): boolean;
    hasSkyLight(): boolean;
    /** Method places colors in rgb format */
    getSkyColor?(): number[];
    /** Method places colors in rgb format */
    getFogColor?(): number[];
    /** Method places colors in rgb format */
    getCloudColor?(): number[];
    /** Method places colors in rgb format */
    getFogDistance?(): [start: number, end: number];
    /** Method places colors in rgb format */
    getSunsetColor?(): number[];
    generateDimensionChunk?(chunkX: number, chunkZ: number, random: java.util.Random): void;
    insidePlayerDimensionTransfer?(playerUid: number, from: number): void;
    outsidePlayerDimensionTransfer?(playerUid: number, to: number): void;
}
interface IPlayerDataCommand extends ICommandParams {
    key: string;
}
declare class PlayerDataCommand extends ServerCommand<IPlayerDataCommand> {
    constructor();
    onServer(client: NetworkClient, data: IPlayerDataCommand): void;
}
declare namespace ServerCommands {
    const PLAYER_DATA: PlayerDataCommand;
}

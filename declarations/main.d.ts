interface ILocalizeable {
    getName(): string;
    getLocalizedName(): string;
}
declare enum Side {
    CLIENT = 0,
    SERVER = 1
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
declare namespace RuntimeData {
    /**
     * Screen name on client.
     */
    namespace local {
        let screenName: EScreenName;
    }
}
declare namespace MathHelper {
    function randomFrom<T>(...elements: T[]): T;
    function randomFromArray<T>(array: T[]): T;
    function radian(gradus: number): number;
    function randomInt(min: number, max: number): number;
    function range(min: number, max: number, number?: number): number[];
}
declare namespace TileEntity {
    function buildEvents(prototype: TileEntity.TileEntityPrototype): void;
    function openFor(client: NetworkClient, tile: TileEntity.TileEntityPrototype & {
        container: ItemContainer;
    }): void;
}
declare namespace ToolAPI {
    function isAxe(item: number): boolean;
    function isPickaxe(item: number): boolean;
    function isShovel(item: number): boolean;
    function isHoe(item: number): boolean;
}
declare namespace Block {
    const destroyFunctions: Record<number, Callback.DestroyBlockFunction>;
    const destroyStartFunctions: Record<number, Callback.DestroyBlockFunction>;
    const destroyContinueFunctions: Record<number, Callback.DestroyBlockContinueFunction>;
    function setEmptyCollisionShape(id: number): void;
    function setSolid(id: number, solid: boolean): void;
    function setRenderAllFaces(id: number, render: boolean): void;
    function setRenderType(id: number, type: number): void;
    function setRenderLayer(id: number, layer: number): void;
    function setLightLevel(id: number, level: number): void;
    function setLightOpacity(id: number, opacity: number): void;
    function setExplosionResistance(id: number, resistance: number): void;
    function setFriction(id: number, friction: number): void;
    function setTranslucency(id: number, translucency: number): void;
    function setSoundType(id: number, type: Sound): void;
    function setMapColor(id: number, color: number): void;
    function setBlockColorSource(id: number, source: ColorSource): void;
    function setMaterialBase(id: number, base_id: number): void;
    function registerDestroyFunction(id: number, func: Callback.DestroyBlockFunction): void;
    function registerDestroyFunctionForID(id: number, func: Callback.DestroyBlockFunction): void;
    function registerDestroyStartFunction(id: number, func: Callback.DestroyBlockFunction): void;
    function registerDestroyStartFunctionForID(id: number, func: Callback.DestroyBlockFunction): void;
    function registerDestroyContinueFunction(id: number, func: Callback.DestroyBlockContinueFunction): void;
    function registerDestroyContinueFunctionForID(id: number, func: Callback.DestroyBlockContinueFunction): void;
}
declare namespace Item {
    const holdFunctions: Record<number, Callback.ItemHoldFunction>;
    function registerHoldFunctionForID(id: number, func: Callback.ItemHoldFunction): void;
    function registerHoldFunction(id: string | number, func: Callback.ItemHoldFunction): void;
}
declare namespace World {
    function getDifficulty(): number;
    function setDifficulty(difficulty: number): void;
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
declare namespace TagRegistry {
    function getBlockTags(id: number): string[];
    function getItemTags(id: number): string[];
    function getDimensionTags(id: number): string[];
}
declare namespace IDRegistry {
    function parseBlockID(id: string): number;
    function parseItemID(id: string): number;
    function parseID(id: string): number;
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
    rotate(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform;
    scale(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform;
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
    function getItemIcon(itemID: string | number, x: number, y: number, size?: number, bitmap?: string): UI.UISlotElement;
}
declare enum EScreenName {
    IN_GAME_PLAY_SCREEN = "in_game_play_screen",
    WORLD_LOADING_PROGRESS_SCREEN = "world_loading_progress_screen",
    ENDER_CHEST_SCREEN = "ender_chest_screen",
    FURNACE_SCREEN = "furnace_screen",
    SMALL_CHEST_SCREEN = "small_chest_screen",
    CREATIVE_INVENTORY_SCREEN = "creative_inventory_screen",
    SURVIVAL_INVENTORY_SCREEN = "survival_inventory_screen",
    INVENTORY_SCREEN = "inventory_screen",
    INVENTORY_SCREEN_POCKET = "inventory_screen_pocket"
}
interface INotificationTimerParams {
    /**
     * time before moving back, in milliseconds
     */
    waitTime?: number;
    /**
     * time before next notification, in milliseconds
     */
    queueTime?: number;
    /**
     * time how much thread is sleep between elements moving, in milliseconds.
     */
    sleepTime?: number;
}
interface INotificationParams extends INotificationTimerParams {
    /**
     * scale of all elements
     */
    scale: number;
    /**
     * width of window. Influences on background width
     */
    width: number;
    /**
     * height of window. Influences on background height
     */
    height: number;
    x?: number;
    y?: number;
    color?: number;
}
type INotificationRuntimeParams = Partial<INotificationParams> & {
    [element: string]: NotificationElement;
};
interface INotificationElementInitEvent {
    onInit?(element: NotificationElement, style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): void;
}
type NotificationElement = (UI.UICustomElement | UI.UIButtonElement | UI.UICloseButtonElement | UI.UIFrameElement | UI.UIImageElement & {
    item?: string | number;
} | UI.UIScaleElement | UI.UIScrollElement | UI.UISlotElement | UI.UISwitchElement | UI.UITabElement | UI.UITextElement & {
    maxLineLength?: number;
} | UI.UIFPSTextElement | UI.UIInvSlotElement) & INotificationElementInitEvent;
type INotificationStyle = INotificationParams | (INotificationParams & {
    [element: string]: NotificationElement;
});
interface INotificationWindowData extends INotificationTimerParams {
    content: UI.WindowContent;
}
interface INotificationInputData {
    styleName: string;
    runtimeStyle: INotificationRuntimeParams;
}
/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 * @example
 * ```ts
    class TransparentNotification extends Notification {
        public mark: boolean = false;

        protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void {
            this.mark = false;
            this.UI.layout.setAlpha(0);
        };

        public setAlpha(value: number): void {
            this.UI.layout.setAlpha(value);
        };

        protected run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean {
            const alpha = this.UI.layout.getAlpha();
            if(alpha < 1 && !this.mark) {
                this.setAlpha(alpha + 0.01);
            } else {
                if(!this.mark) {
                    this.mark = true;
                    java.lang.Thread.sleep(data.waitTime);
                };
            };
            if(this.mark) {
                this.setAlpha(alpha - 0.01);
                if(alpha <= 0) {
                    java.lang.Thread.sleep(style.queueTime);
                    this.close();

                    return true;
                };
            };
        };
    };

    Notification.register("transparent", new TransparentNotification());

    namespace ENotificationStyle {
        export const TRANSPARENT: INotificationStyle = {
            waitTime: 2000,
            queueTime: 1000,
            scale: 2.3,
            width: 220,
            height: 30,
            frame: {
                type: "custom",
                x: 0,
                y: 0,
                width: 220 * 2.3,
                height: 30 * 2.3,
                custom: {
                    onSetup(element) {
                        const paint = this.paint = new android.graphics.Paint();
                        paint.setStyle(android.graphics.Paint.Style.STROKE);
                        paint.setARGB(100, 0, 0, 0);
        
                        element.setSize(220 * 2.3, 30 * 2.3);
                    },
                    onDraw(element, canvas, scale) {
                        canvas.drawRect(0, 0, canvas.getWidth(), canvas.getHeight(), this.paint);
                    }
                }
            },
            text: {
                type: "text",
                x: 48,
                y: 15,
                font: {
                    color: android.graphics.Color.WHITE,
                },
                maxLineLength: 30
            },
            icon: {
                type: "image",
                x: 8,
                y: 10,
            }
        };
    };

    Notification.get("transparent").addStyle("transparent", ENotificationStyle.TRANSPARENT);

    Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
        const obj = {
            text: {
                type: "text",
                text: Item.getName(item.id, item.data)
            },
            icon: {
                type: "image",
                item: item.id
            }
        } as INotificationRuntimeParams;

        Notification.get("transparent").sendFor(player, "transparent", obj);
    });
 * ```
 */
declare abstract class Notification {
    static list: Record<string, Notification>;
    type: string;
    styles: Record<string, INotificationStyle>;
    queue: INotificationInputData[];
    lock: boolean;
    stop: boolean;
    thread: java.lang.Thread;
    UI: UI.Window;
    constructor(type?: string);
    buildPacket(): void;
    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement")
     * @param type type of the notification
     */
    static get<T extends Notification>(type: string): T;
    addStyle(name: string, style: INotificationStyle): this;
    setStop(stop: boolean): this;
    /**
     * Method clears queue
     */
    clearQueue(): void;
    /**
     * Changes lock state
     * @param lock lock state
     */
    setLock(lock: boolean): this;
    getColor(): number;
    getLocationX(): number;
    getLocationY(): number;
    getWidth(): number;
    getHeight(): number;
    getScale(): number;
    getSleepTime(): number;
    getQueueTime(): number;
    getWaitTime(): number;
    protected getDescription(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): INotificationWindowData;
    preventInit(styleName: string, runtimeStyle: INotificationRuntimeParams): boolean;
    onPreventInit(styleName: string, runtimeStyle: INotificationRuntimeParams): void;
    getStyle(styleName: string): INotificationStyle;
    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */
    init(styleName: string, runtimeStyle: INotificationRuntimeParams): void;
    /**
     * Method to init thread, contains logic of change notifications.
     */
    initThread(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): java.lang.Thread;
    /**
     * Method {@link init}s  and deletes last notification from queue
     * @returns true if notification was inited
     */
    initLast(): boolean;
    /**
     * Method, calls after opening ui. It can be used to set default values.
     * @param style Notification style from init.
     * @param description Description of window.
     */
    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    /**
     * Method, where your thread do work. Return true to reload thread with last element from queue.
     * @param style Notification style from init
     * @param runtimeStyle Notification runtime params from init
     * @param description result of {@link getDescription description}
     */
    protected abstract run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): boolean;
    /**
     * Method to send player from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data.
     */
    sendFor(player_uid: number, styleName: string, runtimeStyle: INotificationRuntimeParams): void;
    /**
     * Method, calls with using close function.
     * @param style Notification style from init.
     * @param runtimeStyle your runtime data.
     * @param description result of {@link getDescription description}
     */
    onClose(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    close(style?: INotificationStyle, runtimeStyle?: INotificationRuntimeParams, description?: INotificationWindowData): void;
    static register(type: string, notification: Notification): Notification;
}
declare namespace ENotificationStyle {
    const TRANSPARENT: INotificationStyle;
}
declare class AchievementNotification extends Notification {
    maxHeight: number;
    mark: boolean;
    height: number;
    defaults: {};
    protected updateElementsHeight(value: number): void;
    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    protected run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean;
}
declare class TransparentNotification extends Notification {
    mark: boolean;
    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    setAlpha(value: number): void;
    protected run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean;
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
    add(vector: Vector3): Vector3;
    subtract(vector: Vector3): Vector3;
    multiply(scalar: number): Vector3;
    divide(scalar: number): Vector3;
    dot(vector: Vector3): number;
    cross(vector: Vector3): Vector3;
    length(): number;
    normalize(): Vector3;
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
    equals(stack: ItemInstance | ItemStack): boolean;
    getItemInstance(): ItemInstance;
    isEmpty(): boolean;
    clear(): void;
    getMaxStack(): number;
    getMaxDamage(): number;
    isNativeItem(): boolean;
    getStringID(): string;
    copy(): ItemStack;
}
interface IItemHoldCallback {
    onItemHold?(item: ItemInstance, playerUid: number, slotIndex: number): void;
}
type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];
interface IItemTextureDescription {
    name: string | itemTextureAnimated;
    meta: number;
}
interface IIconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData;
}
interface INoTargetUseCallback {
    onNoTargetUse(item: ItemStack, player: number): void;
}
interface IItemUsingReleasedCallback {
    onUsingReleased(item: ItemStack, ticks: number, player: number): void;
}
interface IItemUsingCompleteCallback {
    onUsingComplete(item: ItemStack, player: number): void;
}
interface IItemUseCallback {
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
    static setFunctions(instance: (IIconOverrideCallback | INoTargetUseCallback | IItemUsingReleasedCallback | IItemUsingCompleteCallback | IItemUseCallback | INameOverrideCallback | IItemHoldCallback | BasicItem) & {
        id: number;
    }): void;
    create(params: ItemParams): void;
}
declare enum EDestroyLevel {
    HAND = 0,
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    OBSIDIAN = 4
}
interface IBlockModel {
    getModel?(): RenderMesh | RenderMesh[] | BlockModel | BlockModel[] | BlockRenderer.Model | ICRender.Model;
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
    readonly variationList: Block.BlockVariation[];
    readonly id: number;
    readonly stringID: string;
    constructor(stringID: string, variationList?: Block.BlockVariation[]);
    canRotate(): boolean;
    build(): void;
    setModel(model: BlockModel | RenderMesh | BlockRenderer.Model | ICRender.Model, data: number): this;
    setStates(states: ReturnType<typeof this.getStates>): void;
    getID(): number;
    getStates(): (string | number)[];
    getTags(): string[];
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
declare abstract class BlockBush extends BlockPlant implements IClickCallback, IRandomTickCallback {
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
declare abstract class LocalTileEntity implements LocalTileEntity {
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
    /**@deprecated
     * Use {@link onLoad} instead
     */
    load(): void;
    /**@deprecated
     * Use {@link onUnload} instead
     */
    unload(): void;
    /**@deprecated
     * Use {@link onTick} instead
     */
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
    /**
     * Scriptable object that contains data of tile entity.
     * You can use it instead {@link defaultValues}
     */
    data: Scriptable;
    /**
     * Scriptable object that contains default data of tile entity.
     */
    defaultValues: Scriptable;
    container: ItemContainer;
    liquidStorage: LiquidRegistry.Storage;
    isLoaded: boolean;
    remove: boolean;
    noupdate: boolean;
    readonly useNetworkItemContainer: boolean;
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
    constructor();
    created(): void;
    /**@deprecated
     * Use {@link onInit} instead
     */
    init(): void;
    /**@deprecated
     * Use {@link onLoad} instead
     */
    load(): void;
    /**@deprecated
     * Use {@link onUnload} instead
     */
    unload(): void;
    /**@deprecated */
    update: () => void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void;
    /**@deprecated
     * Use {@link onDestroyBlock} instead
     */
    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    redstone(params: Callback.RedstoneSignalParams): void;
    /**@deprecated
     * Use {@link onProjectileHit} instead
     */
    projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    /**@deprecated
     * Use {@link onDestroyTile} instead
     */
    destroy(): boolean | void;
    /**@deprecated
     * Use {@link onTick} instead
     */
    tick(): void;
    onInit(): void;
    onLoad(): void;
    onUnload(): void;
    /**
     * Method, calls when player clicks on block with this tile entity. If method returns false, ui will be opened.
     * @param coords
     * @param item
     * @param player
     * @returns boolean
     */
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean | void;
    onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    onProjectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    onDestroyTile(): boolean | void;
    onTick(): void;
    getGuiScreen(): Nullable<UI.IWindow>;
    getScreenByName(screenName?: string, container?: ItemContainer): Nullable<UI.IWindow>;
    getScreenName(player: number, coords: Vector): string;
    preventUI(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean;
    onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean;
    requireMoreLiquid(liquid: string, amount: number): void;
    sendPacket: <T = {}>(name: string, data: T) => {};
    sendResponse: <T = {}>(packetName: string, someData: T) => {};
    selfDestroy(): void;
    getLocalTileEntity(): LocalTileEntity;
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
    isSneaking(): boolean;
    setSneaking(value: boolean): void;
    getName(): string;
    getCarriedItem(): ItemStack;
    decreaseCarriedItem(count?: number): void;
    clearSlot(slot?: number): void;
    clearInventory(): void;
    getSelectedItem(): ItemStack;
    static isCreative(player: number): boolean;
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
/**
 * Enum with names of all callbacks
 */
declare enum ECallback {
    CRAFT_RECIPE_PRE_PROVIDED = "CraftRecipePreProvided",
    CRAFT_RECIPE_PROVIDED_FUNCTION = "CraftRecipeProvidedFunction",
    VANILLA_WORKBENCH_CRAFT = "VanillaWorkbenchCraft",
    VANILLA_WORKBENCH_POST_CRAFT = "VanillaWorkbenchPostCraft",
    VANILLA_WORKBENCH_RECIPE_SELECTED = "VanillaWorkbenchRecipeSelected",
    CONTAINER_CLOSED = "ContainerClosed",
    CONTAINER_OPENED = "ContainerOpened",
    CUSTOM_WINDOW_OPENED = "CustomWindowOpened",
    CUSTOM_WINDOW_CLOSED = "CustomWindowClosed",
    CORE_CONFIGURED = "CoreConfigured",
    PRE_LOADED = "PreLoaded",
    API_LOADED = "APILoaded",
    MODS_LOADED = "ModsLoaded",
    POST_LOADED = "PostLoaded",
    PRE_BLOCKS_DEFINED = "PreBlocksDefined",
    BLOCKS_DEFINED = "BlocksDefined",
    ADD_RUNTIME_PACKS = "AddRuntimePacks",
    LEVEL_SELECTED = "LevelSelected",
    DIMENSION_LOADED = "DimensionLoaded",
    DESTROY_BLOCK_END = "DestroyBlock",
    DESTROY_BLOCK_START = "DestroyBlockStart",
    DESTROY_BLOCK_CONTINUE = "DestroyBlockContinue",
    BUILD_BLOCK = "BuildBlock",
    BLOCK_CHANGED = "BlockChanged",
    BREAK_BLOCK = "BreakBlock",
    ITEM_USE = "ItemUse",
    ITEM_USE_LOCAL_SERVER = "ItemUseLocalServer",
    EXPLOSION = "Explosion",
    FOOD_EATEN = "FoodEaten",
    EXP_ADD = "ExpAdd",
    EXP_LEVEL_ADD = "ExpLevelAdd",
    NATIVE_COMMAND = "NativeCommand",
    PLAYER_ATTACK = "PlayerAttack",
    ENTITY_ADDED = "EntityAdded",
    ENTITY_REMOVED = "EntityRemoved",
    ENTITY_ADDED_LOCAL = "EntityAddedLocal",
    ENTITY_REMOVED_LOCAL = "EntityRemovedLocal",
    ENTITY_DEATH = "EntityDeath",
    ENTITY_HURT = "EntityHurt",
    ENTITY_INTERACT = "EntityInteract",
    EXP_ORBS_SPAWNED = "ExpOrbsSpawned",
    PROJECTILE_HIT = "ProjectileHit",
    REDSTONE_SIGNAL = "RedstoneSignal",
    POP_BLOCK_RESOURCES = "PopBlockResources",
    ITEM_ICON_OVERRIDE = "ItemIconOverride",
    ITEM_NAME_OVERRIDE = "ItemNameOverride",
    ITEM_USE_NO_TARGET = "ItemUseNoTarget",
    ITEM_USING_RELEASED = "ItemUsingReleased",
    ITEM_USING_COMPLETE = "ItemUsingComplete",
    ITEM_DISPENSED = "ItemDispensed",
    NATIVE_GUI_CHANGED = "NativeGuiChanged",
    ENCHANT_POST_ATTACK = "EnchantPostAttack",
    ENCHANT_GET_PROTECTION_BONUS = "EnchantGetProtectionBonus",
    ENCHANT_GET_DAMAGE_BONUS = "EnchantGetDamageBonus",
    ENCHANT_POST_HURT = "EnchantPostHurt",
    GENERATE_CHUNK = "GenerateChunk",
    GENERATE_CHUNK_UNDERGROUND = "GenerateChunkUnderground",
    GENERATE_NETHER_CHUNK = "GenerateNetherChunk",
    GENERATE_END_CHUNK = "GenerateEndChunk",
    GENERATE_CHUNK_UNIVERSAL = "GenerateChunkUniversal",
    GENERATE_BIOME_MAP = "GenerateBiomeMap",
    PRE_PROCESS_CHUNK = "PreProcessChunk",
    POST_PROCESS_CHUNK = "PostProcessChunk",
    READ_SAVES = "ReadSaves",
    WRITE_SAVES = "WriteSaves",
    CUSTOM_BLOCK_TESSELLATION = "CustomBlockTessellation",
    LOCAL_PLAYER_TICK = "LocalPlayerTick",
    SERVER_PLAYER_TICK = "ServerPlayerTick",
    CUSTOM_DIMENSION_TRANSFER = "CustomDimensionTransfer",
    BLOCK_EVENT_ENTITY_INSIDE = "BlockEventEntityInside",
    BLOCK_EVENT_ENTITY_STEP_ON = "BlockEventEntityStepOn",
    BLOCK_EVENT_NEIGHBOUR_CHANGE = "BlockEventNeighbourChange",
    CONNECTING_TO_HOST = "ConnectingToHost",
    DIMENSION_UNLOADED = "DimensionUnloaded",
    LEVEL_PRE_LEFT = "LevelPreLeft",
    GAME_LEFT = "GameLeft",
    LEVEL_LEFT = "LevelLeft",
    LOCAL_LEVEL_LEFT = "LocalLevelLeft",
    LOCAL_LEVEL_PRE_LEFT = "LocalLevelPreLeft",
    SERVER_LEVEL_LEFT = "ServerLevelLeft",
    SERVER_LEVEL_PRE_LEFT = "ServerLevelPreLeft",
    ITEM_USE_LOCAL = "ItemUseLocal",
    SYSTEM_KEY_EVENT_DISPATCHED = "SystemKeyEventDispatched",
    NAVIGATION_BACK_PRESSED = "NavigationBackPressed",
    LEVEL_CREATED = "LevelCreated",
    LEVEL_DISPLAYED = "LevelDisplayed",
    LEVEL_PRE_LOADED = "LevelPreLoaded",
    LEVEL_LOADED = "LevelLoaded",
    LOCAL_LEVEL_LOADED = "LocalLevelLoaded",
    REMOTE_LEVEL_LOADED = "RemoteLevelLoaded",
    REMOTE_LEVEL_PRE_LOADED = "RemoteLevelPreLoaded",
    SERVER_LEVEL_LOADED = "ServerLevelLoaded",
    SERVER_LEVEL_PRE_LOADED = "ServerLevelPreLoaded",
    TICK = "tick",
    LOCAL_TICK = "LocalTick",
    APP_SUSPENDED = "AppSuspended",
    ENTITY_PICK_UP_DROP = "EntityPickUpDrop",
    LOCAL_PLAYER_LOADED = "LocalPlayerLoaded",
    SERVER_PLAYER_LOADED = "ServerPlayerLoaded",
    SERVER_PLAYER_LEFT = "ServerPlayerLeft",
    LOCAL_PLAYER_CHANGED_DIMENSION = "LocalPlayerChangedDimension",
    PLAYER_CHANGED_DIMENSION = "PlayerChangedDimension",
    LOCAL_PLAYER_EAT = "LocalPlayerEat",
    SERVER_PLAYER_EAT = "ServerPlayerEat",
    GENERATE_CUSTOM_DIMENSION_CHUNK = "GenerateCustomDimensionChunk",
    TILE_ENTITY_ADDED = "TileEntityAdded",
    TILE_ENTITY_REMOVED = "TileEntityRemoved",
    /**
     * Custom callback. Works in one time of 8 ticks, if player held the item.
     */
    ITEM_HOLD = "ItemHold"
}
/**
 * The factory of decorators to add callback from function.
 * @example
 * ```ts
    class Example {
        [@SubscribeEvent(ECallback.LOCAL_TICK)]
        public onTick() {
            Game.message("example")
        }
    };
 * ```
 * @param event {@link ECallback} enum value
 * @returns decorator
 */
declare function SubscribeEvent(event: ECallback): MethodDecorator;
/**
 * Decorator to add callback from function by function name and same function. Format will be "onNameOfCallback". "on" optional.
 * @example
 * ```ts
 * class ExampleDestroyBlock {
        [@SubscribeEvent]
        public onDestroyBlock() {
            Game.message("break block")
        }
    }
 * ```
 * @param target
 * @param key
 * @param descriptor
 */
declare function SubscribeEvent(target: unknown, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;
declare namespace Callback {
    /**
     * Function used in "ItemHold" callback. Callback works one time of 8 ticks.
     * @since 0.1a
     * @param item ItemInstance of held item
     * @param playerUid unique identifier of holder player
     */
    interface ItemHoldFunction {
        (item: ItemInstance, playerUid: number, slotIndex: number): void;
    }
    function addCallback(name: "ItemHold", func: ItemHoldFunction, priority?: number): void;
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

declare let screenName: any;
declare function separateText(text: string, lineSize?: number): string;
interface INotificationTimerParams<thread> {
    /**
     * Values, usings in thread.
     */
    thread: {
        /**
         * time before moving back, in milliseconds.
         */
        reachTime?: number;
        /**
         * time between next notification, in milliseconds.
         */
        queueTime?: number;
        /**
         * time how much thread is sleep between elements moving, in milliseconds.
         */
        sleepTime?: number;
    } & thread;
}
interface INotificationParams<window = {}, thread = {}, events = {}> extends INotificationTimerParams<thread> {
    /**
     * Values to describe window.
     */
    window: {
        /**
         * scale of all elements.
         */
        scale?: number;
        /**
         * width of window in units.
         */
        width?: number;
        /**
         * height of window in units.
         */
        height?: number;
        /**
         * x position of window.
         */
        x?: number;
        /**
         * y position of window.
         */
        y?: number;
        /**
         * color of window in red green blue alpha.
         */
        color?: number;
        /**
         * if true, window will be game overlay (can you hear sounds).
         */
        overlay?: boolean;
        /**
         * if true, window will be touchable (you can touch window with specified element events).
         */
        touchable?: boolean;
    } & window;
    /**
     * Events
     */
    events?: {
        onReach?(notification: Notification): void;
        onClose?(notification: Notification): void;
    } & events;
    /**
     * Elements from {@link UI.ElementSet}.
     */
    elements: Record<string, NotificationElement>;
}
interface INotificationElementInitEvent {
    preInit?(element: NotificationElement, style: INotificationParams): void;
    postInit?(element: NotificationElement, style: INotificationParams): void;
}
type NotificationElement = (UI.UICustomElement | UI.UIButtonElement | UI.UICloseButtonElement | UI.UIFrameElement | UI.UIImageElement & {
    /**
     * if defined, element will become slot, and scale from element will become iconScale.
     */
    item?: string | number;
} | UI.UIScaleElement | UI.UIScrollElement | UI.UISlotElement | UI.UISwitchElement | UI.UITabElement | UI.UITextElement & {
    /**
     * Max size of line. If text bigger, element will become multiline and `\n` will be placed each specified number.
     * @default 25
    */
    lineSize?: number;
} | UI.UIFPSTextElement | UI.UIInvSlotElement) & INotificationElementInitEvent;
interface INotificationInputData<T> {
    styleName: string;
    runtimeStyle: Partial<T>;
}
/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 */
declare abstract class Notification<T extends INotificationParams = INotificationParams> {
    /**
     * List of all notifications with special unique type.
     */
    static list: Record<string, Notification>;
    /**
     * Type of animation. Must be unique
     */
    type: string;
    /**
     * List of styles
     */
    protected styles: Record<string, T>;
    /**
     * Queue, from this field takes values to restart animation after previous.
     */
    protected queue: INotificationInputData<T>[];
    /**
     * Lock value, influences on init.
     */
    protected lock: boolean;
    /**
     * Stop value, influences on work of animation.
     */
    protected stop: boolean;
    /**
     * Thread special for notification.
     */
    thread: java.lang.Thread;
    /**
     * Current name of style from last start.
     */
    currentStyleName: string;
    /**
     * Current style, which usings in current notification from last start.
     */
    currentStyle: T;
    /**
     * User interface, using in animation.
     */
    UI: UI.Window;
    constructor(type?: string);
    /**
     * Method to add client packet, which can init animation for client from server request.
     */
    buildPacket(): void;
    /**
     * Method to register new style for notification.
     * @param name name of your style
     * @param style style description
     */
    addStyle(name: string, style: T): this;
    /**
     * Method to disable thread if stop state is true.
     * @param stop state
     */
    setStop(stop: boolean): this;
    /**
     * Method clears queue.
     */
    clearQueue(): void;
    /**
     * Changes lock state.
     * @param lock lock state
     */
    setLock(lock: boolean): this;
    /**
     * Default value of UI color.
     */
    getColor(): number;
    /**
     * Default value of x.
     */
    getLocationX(): number;
    /**
     * Default value of y.
     */
    getLocationY(): number;
    /**
     * Default value of width.
     */
    getWidth(): number;
    /**
     * Default value of height.
     */
    getHeight(): number;
    /**
     * Default value of scale.
     * @default 1
     */
    getScale(): number;
    /**
     * Time which using to sleep thread every cycle. Influences on speed of animation.
     */
    getSleepTime(): number;
    /**
     * Time between restart animation with new data.
     */
    getQueueTime(): number;
    /**
     * Time to sleep in reach state.
     */
    getReachTime(): number;
    /**
     * @returns ui is touchable or not (if not, button clicks will not work).
     */
    isTouchable(): boolean;
    /**
     * @returns ui is game overlay or not.
     */
    isGameOverlay(): boolean;
    /**
     * Condition to prevent init animation.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     * @returns
     */
    preventInit(styleName: string, runtimeStyle: Partial<T>): boolean;
    /**
     * Method, works when animation was prevented.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    protected onPreventInit(styleName: string, runtimeStyle: Partial<T>): void;
    /**
     * Method to get style.
     * Throws `java.lang.NoSuchFieldException` if style is not exists.
     * @param styleName name of style
     * @returns Notification style
     */
    getStyle(styleName: string): T;
    /**
     * Method to set content of window
     */
    protected setContent(): void;
    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */
    init(styleName: string, runtimeStyle: Partial<T>): void;
    /**
     * Method to init thread, contains logic of change notifications.
     */
    protected run(): void;
    /**
     * Method {@link init inits} and deletes last notification from queue.
     * @returns true if notification was inited
     */
    initLast(): boolean;
    /**
     * Method to get common style from basic style and runtime data.
     * @param style your style
     * @param runtimeStyle your runtime data
     */
    protected getCommonStyle(style: T, runtimeStyle: Partial<T>): T;
    /**
     * Method, works before opening ui.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    protected preInit(style: T, runtimeStyle: Partial<T>): void;
    /**
     * Method, calls after opening ui. It can be used to set default values.
     */
    protected postInit(): void;
    /**
     * Method, where your thread do work. Return true to reload thread with last element from queue.
     */
    protected abstract work(): boolean;
    /**
     * Method to send client from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data
     */
    sendFor(playerUid: number, styleName: string, runtimeStyle: Partial<INotificationParams>): void;
    /**
     * Method, calls with using close function.
     */
    protected onClose(): void;
    /**
     * Method to close ui and call close events.
     */
    close(): void;
    /**
     * Method to call reach events.
     *
     */
    reach(): void;
    /**
     * Method works when elements reaches need position.
     */
    protected onReach(): void;
    /**
     * Method to get styled location
     * @param style style
     * @param x addition x value concating with main, optional
     * @param y addition y value concating with main, optional
     */
    protected static getStyledLocation<T extends INotificationParams>(style: T, x?: number, y?: number): UI.WindowLocationParams;
    /**
     * Method to get element set from your style
     * @param x addition x value concats to main, optional
     * @param y addition y value concats to main, optional
     * @param keyword word, adds to default key name, optional. If defined, after keyword `"_"` will be added
     * @returns default `UI.ElementSet`
     */
    protected static getStyledElementSet<T extends INotificationParams>(style: T, x?: number, y?: number, keyword?: string): UI.ElementSet;
    /**
     * Method to learn, exists type of notification or not.
     */
    static has(type: string): boolean;
    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement").
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param type type of the notification
     */
    static get<T extends Notification>(type: string): T;
    /**
     * Method to register new notification with special type.
     * Throws `java.lang.SecurityException` if notification exists.
     * @param type keyword to register notification
     * @param notification object of notification
     */
    static register(type: string, notification: Notification): Notification;
    /**
     * Method to learn is active type or not now.
     */
    static isActive(type: string): boolean;
    /**
     * Method to get active types.
     * @returns active types of notifications
     */
    static getActiveTypes(): string[];
    /**
     * Method to init notification with special type.
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    static init(type: string, styleName: string, runtimeStyle: Partial<INotificationParams>): void;
    /**
     * Method to send client from server notification with specified style name and runtime data.
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param playerUid unique player identifier
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    static sendFor(playerUid: number, type: string, styleName: string, runtimeStyle: Partial<INotificationParams>): void;
}
declare namespace NotificationStyles {
    const TRANSPARENT: INotificationParams;
}
declare class TransparentNotification extends Notification {
    mark: boolean;
    setAlpha(value: number): void;
    protected postInit(): void;
    protected work(): boolean;
}
declare class AchievementNotification extends Notification {
    maxHeight: number;
    mark: boolean;
    height: number;
    defaultHeights: Record<string, number>;
    protected updateElementsHeight(height: number): void;
    protected setDefaultHeights(): void;
    protected postInit(): void;
    protected work(): boolean;
}
type IAdvancementParams = INotificationParams<{
    /**
    * position of the window, influences on moving of animation.
    * @default "right"
    */
    position?: "left" | "right";
    /**
    * max count of notifications in one screen in one time when position and style equals.
    * @default 4;
    */
    maxCount?: number;
}>;
declare class AdvancementNotification extends Notification<IAdvancementParams> {
    maxOffset: number;
    mark: boolean;
    offset: number;
    defaultOffsets: Record<string, number>;
    protected setDefaultOffsets(): void;
    protected updateElementsOffset(offset: number): void;
    getSleepTime(): number;
    protected setContent(): void;
    protected preInit(style: IAdvancementParams, runtimeStyle: Partial<IAdvancementParams>): void;
    protected postInit(): void;
    animationLeft(): boolean;
    animationRight(): boolean;
    protected work(): boolean;
}

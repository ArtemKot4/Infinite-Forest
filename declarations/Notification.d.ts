/**
 * Библиотека открыта для всех желающих легко создавать анимации, подобные анимациям достижений из Java издания игры.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */
declare let screenName: any;
declare function separateText(text: string, line_size?: number): string;
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
    /**
     * Method to add client packet, which can init animation for client from server request.
     */
    buildPacket(): void;
    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement")
     * @param type type of the notification
     */
    static get<T extends Notification>(type: string): T;
    /**
     * Method to register new style for notification
     * @param name name of your style
     * @param style style description
     */
    addStyle(name: string, style: INotificationStyle): this;
    /**
     * Method to disable thread if stop state is true.
     * @param stop state
     */
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
    run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
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
    protected abstract work(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): boolean;
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
declare namespace NotificationStyles {
    const TRANSPARENT: INotificationStyle;
}
declare class TransparentNotification extends Notification {
    mark: boolean;
    setAlpha(value: number): void;
    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    protected work(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean;
}
declare class AchievementNotification extends Notification {
    maxHeight: number;
    mark: boolean;
    height: number;
    defaults: {};
    protected updateElementsHeight(value: number): void;
    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void;
    protected work(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean;
}

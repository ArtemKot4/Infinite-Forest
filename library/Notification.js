/**
 * Библиотека открыта для всех желающих легко создавать анимации, подобные анимациям достижений из Java издания игры.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
LIBRARY({
    name: "Notification",
    shared: true,
    version: 1,
    api: "CoreEngine"
});
var screenName = null;
Callback.addCallback("NativeGuiChanged", function (name, lastName, isPushEvent) {
    screenName = name;
});
function separateText(text, line_size) {
    var e_1, _a;
    if (line_size === void 0) { line_size = 25; }
    var result = [];
    var line = "";
    try {
        for (var _b = __values(text.split(" ")), _c = _b.next(); !_c.done; _c = _b.next()) {
            var word = _c.value;
            if (line.length + word.length <= line_size) {
                line += word + " ";
            }
            else {
                result.push(line.trim());
                line = word + " ";
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (line) {
        result.push(line.trim());
    }
    return result.join("\n");
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
var Notification = /** @class */ (function () {
    function Notification(type) {
        this.styles = {};
        this.queue = [];
        this.lock = false;
        this.stop = false;
        this.UI = (function () {
            var window = new UI.Window();
            window.setAsGameOverlay(true);
            window.setDynamic(true);
            window.setTouchable(false);
            return window;
        })();
        if (type)
            this.type = type;
    }
    ;
    /**
     * Method to add client packet, which can init animation for client from server request.
     */
    Notification.prototype.buildPacket = function () {
        var _this = this;
        Network.addClientPacket("packet.notification.send_".concat(this.type, "_notification"), function (data) {
            return _this.init(data.styleName, data.runtimeStyle);
        });
    };
    ;
    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement")
     * @param type type of the notification
     */
    Notification.get = function (type) {
        if (!(type in this.list)) {
            throw new java.lang.NoSuchFieldException("Notification: notification not found");
        }
        ;
        return this.list[type];
    };
    /**
     * Method to register new style for notification
     * @param name name of your style
     * @param style style description
     */
    Notification.prototype.addStyle = function (name, style) {
        this.styles[name] = style;
        return this;
    };
    /**
     * Method to disable thread if stop state is true.
     * @param stop state
     */
    Notification.prototype.setStop = function (stop) {
        this.stop = stop;
        return this;
    };
    /**
     * Method clears queue
     */
    Notification.prototype.clearQueue = function () {
        this.queue = [];
    };
    /**
     * Changes lock state
     * @param lock lock state
     */
    Notification.prototype.setLock = function (lock) {
        this.lock = lock;
        return this;
    };
    Notification.prototype.getColor = function () {
        return android.graphics.Color.TRANSPARENT;
    };
    Notification.prototype.getLocationX = function () {
        return 0;
    };
    Notification.prototype.getLocationY = function () {
        return 0;
    };
    Notification.prototype.getWidth = function () {
        return 200;
    };
    Notification.prototype.getHeight = function () {
        return 100;
    };
    Notification.prototype.getScale = function () {
        return 1;
    };
    Notification.prototype.getSleepTime = function () {
        return 3;
    };
    Notification.prototype.getQueueTime = function () {
        return 1000;
    };
    Notification.prototype.getWaitTime = function () {
        return 2000;
    };
    Notification.prototype.getDescription = function (style, runtimeStyle) {
        var scale = runtimeStyle.scale || style.scale || this.getScale();
        var width = (runtimeStyle.width || style.width || this.getWidth()) * scale;
        var height = (runtimeStyle.height || style.height || this.getHeight()) * scale;
        var content = {
            location: {
                x: runtimeStyle.x || style.x || this.getLocationX(),
                y: runtimeStyle.y || style.y || this.getLocationY(),
                width: width,
                height: height
            },
            drawing: [{
                    type: "background",
                    color: runtimeStyle.color || style.color || this.getColor(),
                }],
            elements: {}
        };
        for (var element_name in style) {
            var description = style[element_name];
            if (typeof description !== "number") {
                var runtime = runtimeStyle[element_name] || {};
                var defaultX = (runtime.x || description.x) * scale;
                var defaultY = (runtime.y || description.y) * scale;
                var element = Object.assign({}, description, runtime, {
                    x: defaultX,
                    y: defaultY
                });
                if (description.text || runtime.text) {
                    var maxLineLength = (runtime.maxLineLength || description.maxLineLength) || 20;
                    var text = separateText(Translation.translate(runtime.text || description.text), maxLineLength);
                    element.text = text;
                    if (text.length > maxLineLength) {
                        element.multiline = true;
                    }
                }
                if (description.item || runtime.item) {
                    var item = runtime.item || description.item;
                    element.type = "slot";
                    element.bitmap = "unknown";
                    element.source = {
                        id: typeof item == "string" ? (ItemID[item] || VanillaItemID[item] || BlockID[item] || VanillaBlockID[item]) : item,
                        count: 1,
                        data: 0
                    };
                    element.iconScale = 1;
                }
                if ("onInit" in element) {
                    element.onInit(element, style, runtimeStyle);
                }
                content.elements[element_name] = element;
            }
        }
        return ({
            content: content,
            queueTime: runtimeStyle.queueTime || style.queueTime || this.getQueueTime(),
            sleepTime: runtimeStyle.sleepTime || style.sleepTime || this.getSleepTime(),
            waitTime: runtimeStyle.waitTime || style.waitTime || this.getWaitTime()
        });
    };
    Notification.prototype.preventInit = function (styleName, runtimeStyle) {
        return this.lock == true || screenName !== "in_game_play_screen";
    };
    ;
    Notification.prototype.onPreventInit = function (styleName, runtimeStyle) {
        this.queue.push({ styleName: styleName, runtimeStyle: runtimeStyle });
    };
    Notification.prototype.getStyle = function (styleName) {
        if (!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException("Notification error: style ".concat(styleName, " is not exists"));
        }
        return this.styles[styleName];
    };
    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */
    Notification.prototype.init = function (styleName, runtimeStyle) {
        var _this = this;
        if (this.preventInit(styleName, runtimeStyle)) {
            return this.onPreventInit(styleName, runtimeStyle);
        }
        var style = this.getStyle(styleName);
        var description = this.getDescription(style, runtimeStyle);
        if (!this.UI.isOpened()) {
            this.UI.open();
        }
        this.setLock(true);
        this.UI.setContent(description.content);
        this.UI.updateWindowLocation();
        this.UI.forceRefresh();
        this.onInit(style, runtimeStyle, description);
        this.thread = Threading.initThread("thread.ui.".concat(this.type, "_notification"), function () { return _this.run(style, runtimeStyle, description); });
        return;
    };
    /**
     * Method to init thread, contains logic of change notifications.
     */
    Notification.prototype.run = function (style, runtimeStyle, description) {
        while (this.stop === false) {
            java.lang.Thread.sleep(description.sleepTime);
            var done = this.work(style, runtimeStyle, description);
            if (done === true) {
                this.setLock(false);
                this.initLast();
                break;
            }
        }
    };
    /**
     * Method {@link init}s  and deletes last notification from queue
     * @returns true if notification was inited
     */
    Notification.prototype.initLast = function () {
        if (this.queue.length > 0 && screenName === "in_game_play_screen") {
            var data = this.queue.shift();
            this.init(data.styleName, data.runtimeStyle);
            return true;
        }
        return false;
    };
    /**
     * Method, calls after opening ui. It can be used to set default values.
     * @param style Notification style from init.
     * @param description Description of window.
     */
    Notification.prototype.onInit = function (style, runtimeStyle, description) { };
    /**
     * Method to send player from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data.
     */
    Notification.prototype.sendFor = function (player_uid, styleName, runtimeStyle) {
        var client = Network.getClientForPlayer(player_uid);
        if (client) {
            client.send("packet.notification.send_".concat(this.type, "_notification"), { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    };
    /**
     * Method, calls with using close function.
     * @param style Notification style from init.
     * @param runtimeStyle your runtime data.
     * @param description result of {@link getDescription description}
     */
    Notification.prototype.onClose = function (style, runtimeStyle, description) { };
    Notification.prototype.close = function (style, runtimeStyle, description) {
        this.onClose(style, runtimeStyle, description);
        this.UI.close();
    };
    Notification.register = function (type, notification) {
        if (type in Notification.list) {
            throw new java.lang.SecurityException("Notification: notification is already registered");
        }
        ;
        if (!notification.type) {
            notification.type = type;
            notification.buildPacket();
        }
        ;
        return Notification.list[type] = notification;
    };
    Notification.list = {};
    return Notification;
}());
Callback.addCallback("LocalLevelLeft", function () {
    for (var i in Notification.list) {
        var notification = Notification.list[i];
        notification.clearQueue();
        notification.setStop(true);
        notification.UI.close();
    }
});
Callback.addCallback("NativeGuiChanged", function (name, lastName, isPushEvent) {
    if (name === "in_game_play_screen") {
        for (var i in Notification.list) {
            var notification = Notification.list[i];
            notification.initLast();
        }
    }
});
var NotificationStyles;
(function (NotificationStyles) {
    NotificationStyles.TRANSPARENT = {
        waitTime: 2000,
        queueTime: 1000,
        scale: 2.3,
        width: 180,
        height: 20,
        frame: {
            type: "custom",
            x: 0,
            y: 0,
            width: 220 * 2.3,
            height: 30 * 2.3,
            custom: {
                onSetup: function (element) {
                    this.paint = new android.graphics.Paint();
                    this.paint.setARGB(100, 0, 0, 0);
                    element.setSize(180 * 2.3, 20 * 2.3);
                },
                onDraw: function (element, canvas, scale) {
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
            y: 10
        }
    };
})(NotificationStyles || (NotificationStyles = {}));
;
// Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
//     const obj = {
//         text: {
//             type: "text",
//             text: Item.getName(item.id, item.data)
//         },
//         icon: {
//             type: "image",
//             item: item.id
//         }
//     } as INotificationRuntimeParams;
//     if(Entity.getSneaking(player)) {
//         Notification.get("achievement").sendFor(player, "transparent", obj);
//     } else {
//         Notification.get("transparent").sendFor(player, "transparent", obj);
//     };
// }); //debug
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TransparentNotification = /** @class */ (function (_super) {
    __extends(TransparentNotification, _super);
    function TransparentNotification() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mark = false;
        return _this;
    }
    TransparentNotification.prototype.setAlpha = function (value) {
        this.UI.layout.setAlpha(value);
    };
    TransparentNotification.prototype.onInit = function (style, runtimeStyle, description) {
        this.mark = false;
        this.UI.layout.setAlpha(0);
    };
    TransparentNotification.prototype.work = function (style, runtimeStyle, data) {
        var alpha = this.UI.layout.getAlpha();
        if (alpha < 1 && !this.mark) {
            this.setAlpha(alpha + 0.01);
        }
        else {
            if (!this.mark) {
                this.mark = true;
                java.lang.Thread.sleep(data.waitTime);
            }
        }
        if (this.mark) {
            this.setAlpha(alpha - 0.01);
            if (alpha <= 0) {
                java.lang.Thread.sleep(style.queueTime);
                this.close();
                return true;
            }
        }
    };
    return TransparentNotification;
}(Notification));
Notification.register("transparent", new TransparentNotification())
    .addStyle("transparent", NotificationStyles.TRANSPARENT);
var AchievementNotification = /** @class */ (function (_super) {
    __extends(AchievementNotification, _super);
    function AchievementNotification() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxHeight = 100;
        _this.mark = false;
        _this.height = 0;
        return _this;
    }
    AchievementNotification.prototype.updateElementsHeight = function (value) {
        var elements = this.UI.getElements();
        for (var name in this.defaults) {
            elements.get(name).setPosition(this.defaults[name].x, value + this.defaults[name].y);
        }
    };
    AchievementNotification.prototype.onInit = function (style, runtimeStyle, description) {
        this.maxHeight = style.height * style.scale;
        this.height = -this.maxHeight;
        this.mark = false;
        this.defaults = {};
        for (var i in description.content.elements) {
            var element = description.content.elements[i];
            this.defaults[i] = {
                x: element.x || 0,
                y: element.y || 0
            };
        }
    };
    AchievementNotification.prototype.work = function (style, runtimeStyle, data) {
        if (!this.mark) {
            if (this.height < 0) {
                this.updateElementsHeight(this.height += 1);
            }
            else {
                java.lang.Thread.sleep(data.waitTime);
                this.mark = true;
            }
        }
        else {
            if (this.height > -this.maxHeight) {
                this.updateElementsHeight(this.height -= 1);
            }
            else {
                java.lang.Thread.sleep(style.queueTime);
                this.close();
                return true;
            }
        }
    };
    return AchievementNotification;
}(Notification));
Notification.register("achievement", new AchievementNotification())
    .addStyle("transparent", NotificationStyles.TRANSPARENT);
EXPORT("Notification", Notification);
EXPORT("TransparentNotification", TransparentNotification);
EXPORT("AchievementNotification", AchievementNotification);

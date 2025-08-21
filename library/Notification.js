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
/**
 * Данная библиотека была разработана для упрощения создания экранных анимаций.
 * Библиотека разработана с упором на производительность и высокую скорость работы, что позволяет вам создавать собственные быстрые и стабильные анимации.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете:
 * код открыт для ознакомления, однако копирование любой части вне контекста использования данной библиотеки недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать мне в discord: discordapp.com/users/908847403073937419
 */
LIBRARY({
    name: "Notification",
    shared: true,
    version: 1,
    api: "CoreEngine"
});
var screenName = null;
function separateText(text, lineSize) {
    var e_1, _a;
    if (lineSize === void 0) { lineSize = 25; }
    var result = [];
    var line = "";
    try {
        for (var _b = __values(text.split(" ")), _c = _b.next(); !_c.done; _c = _b.next()) {
            var word = _c.value;
            if (line.length + word.length <= lineSize) {
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
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Notification = /** @class */ (function () {
    function Notification(type) {
        /**
         * List of styles
         */
        this.styles = {};
        /**
         * Queue, from this field takes values to restart animation after previous.
         */
        this.queue = [];
        /**
         * Lock value, influences on init.
         */
        this.lock = false;
        /**
         * Stop value, influences on work of animation.
         */
        this.stop = false;
        /**
         * User interface, using in animation.
         */
        this.UI = (function () {
            var window = new UI.Window();
            window.setDynamic(true);
            return window;
        })();
        if (type != null) {
            this.type = type;
        }
    }
    /**
     * Method to add client packet, which can init animation for client from server request.
     */
    Notification.prototype.buildPacket = function () {
        var _this = this;
        Network.addClientPacket("packet.notification.send_".concat(this.type, "_notification"), function (data) {
            return _this.init(data.styleName, data.runtimeStyle);
        });
    };
    /**
     * Method to register new style for notification.
     * @param name name of your style
     * @param style style description
     */
    Notification.prototype.addStyle = function (name, style) {
        style.thread = style.thread || {};
        style.elements = style.elements || {};
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
     * Method clears queue.
     */
    Notification.prototype.clearQueue = function () {
        this.queue = [];
    };
    /**
     * Changes lock state.
     * @param lock lock state
     */
    Notification.prototype.setLock = function (lock) {
        this.lock = lock;
        return this;
    };
    /**
     * Default value of UI color.
     */
    Notification.prototype.getColor = function () {
        return android.graphics.Color.TRANSPARENT;
    };
    /**
     * Default value of x.
     */
    Notification.prototype.getLocationX = function () {
        return 0;
    };
    /**
     * Default value of y.
     */
    Notification.prototype.getLocationY = function () {
        return 0;
    };
    /**
     * Default value of width.
     */
    Notification.prototype.getWidth = function () {
        return 200;
    };
    /**
     * Default value of height.
     */
    Notification.prototype.getHeight = function () {
        return 100;
    };
    /**
     * Default value of scale.
     * @default 1
     */
    Notification.prototype.getScale = function () {
        return 1;
    };
    /**
     * Time which using to sleep thread every cycle. Influences on speed of animation.
     */
    Notification.prototype.getSleepTime = function () {
        return 3;
    };
    /**
     * Time between restart animation with new data.
     */
    Notification.prototype.getQueueTime = function () {
        return 1000;
    };
    /**
     * Time to sleep in reach state.
     */
    Notification.prototype.getReachTime = function () {
        return 2000;
    };
    /**
     * @returns ui is touchable or not (if not, button clicks will not work).
     */
    Notification.prototype.isTouchable = function () {
        return true;
    };
    /**
     * @returns ui is game overlay or not.
     */
    Notification.prototype.isGameOverlay = function () {
        return true;
    };
    /**
     * Condition to prevent init animation.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     * @returns
     */
    Notification.prototype.preventInit = function (styleName, runtimeStyle) {
        return this.lock == true || screenName != "in_game_play_screen";
    };
    /**
     * Method, works when animation was prevented.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    Notification.prototype.onPreventInit = function (styleName, runtimeStyle) {
        this.queue.push({ styleName: styleName, runtimeStyle: runtimeStyle });
    };
    /**
     * Method to get style.
     * Throws `java.lang.NoSuchFieldException` if style is not exists.
     * @param styleName name of style
     * @returns Notification style
     */
    Notification.prototype.getStyle = function (styleName) {
        if (!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException("Notification error: style ".concat(styleName, " is not exists"));
        }
        return this.styles[styleName];
    };
    /**
     * Method to set content of window
     */
    Notification.prototype.setContent = function () {
        this.UI.setContent({
            location: Notification.getStyledLocation(this.currentStyle),
            drawing: [{
                    type: "background",
                    color: this.currentStyle.window.color
                }],
            elements: Notification.getStyledElementSet(this.currentStyle)
        });
        this.UI.forceRefresh();
    };
    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */
    Notification.prototype.init = function (styleName, runtimeStyle) {
        var _this = this;
        if (this.preventInit(styleName, runtimeStyle)) {
            return this.onPreventInit(styleName, runtimeStyle);
        }
        this.currentStyleName = styleName;
        var style = this.getStyle(styleName);
        this.currentStyle = {
            thread: {},
            window: {},
            elements: {}
        };
        this.preInit(style, runtimeStyle);
        this.UI.setAsGameOverlay(this.currentStyle.window.overlay);
        this.UI.setTouchable(this.currentStyle.window.touchable);
        this.UI.updateWindowLocation();
        if (!this.UI.isOpened()) {
            this.UI.open();
        }
        this.setLock(true);
        this.setContent();
        this.postInit();
        this.thread = Threading.initThread("thread.ui.notification.".concat(this.type), function () { return _this.run(); });
        return;
    };
    /**
     * Method to init thread, contains logic of change notifications.
     */
    Notification.prototype.run = function () {
        while (this.stop == false) {
            java.lang.Thread.sleep(this.currentStyle.thread.sleepTime);
            var done = this.work();
            if (done == true) {
                this.setLock(false);
                this.initLast();
                break;
            }
        }
    };
    /**
     * Method {@link init inits} and deletes last notification from queue.
     * @returns true if notification was inited
     */
    Notification.prototype.initLast = function () {
        if (this.queue.length > 0 && screenName == "in_game_play_screen") {
            var data = this.queue.shift();
            this.init(data.styleName, data.runtimeStyle);
            return true;
        }
        return false;
    };
    /**
     * Method to get common style from basic style and runtime data.
     * @param style your style
     * @param runtimeStyle your runtime data
     */
    Notification.prototype.getCommonStyle = function (style, runtimeStyle) {
        runtimeStyle.thread = runtimeStyle.thread || {};
        runtimeStyle.window = runtimeStyle.window || {};
        var commonStyle = {
            thread: {},
            window: {},
            elements: {},
            events: {}
        };
        commonStyle.thread.sleepTime = (runtimeStyle.thread.sleepTime || style.thread.sleepTime) || this.getSleepTime();
        commonStyle.thread.reachTime = (runtimeStyle.thread.reachTime || style.thread.reachTime) || this.getReachTime();
        commonStyle.thread.queueTime = (runtimeStyle.thread.queueTime || style.thread.queueTime) || this.getQueueTime();
        commonStyle.window.color = (runtimeStyle.window.color || style.window.color) || this.getColor();
        commonStyle.window.height = (runtimeStyle.window.height || style.window.height) || this.getHeight();
        commonStyle.window.width = (runtimeStyle.window.width || style.window.width) || this.getWidth();
        commonStyle.window.scale = (runtimeStyle.window.scale || style.window.scale) || this.getScale();
        commonStyle.window.x = (runtimeStyle.window.x || style.window.x) || this.getLocationX();
        commonStyle.window.y = (runtimeStyle.window.y || style.window.y) || this.getLocationY();
        commonStyle.window.overlay = (runtimeStyle.window.overlay || style.window.overlay) || this.isGameOverlay();
        commonStyle.window.touchable = (runtimeStyle.window.touchable || style.window.touchable) || this.isTouchable();
        for (var elementName in style.elements) {
            commonStyle.elements[elementName] = Object.assign({}, style.elements[elementName], runtimeStyle.elements[elementName] || {});
        }
        return commonStyle;
    };
    /**
     * Method, works before opening ui.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    Notification.prototype.preInit = function (style, runtimeStyle) {
        this.currentStyle = this.getCommonStyle(style, runtimeStyle);
    };
    /**
     * Method, calls after opening ui. It can be used to set default values.
     */
    Notification.prototype.postInit = function () { };
    ;
    /**
     * Method to send client from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data
     */
    Notification.prototype.sendFor = function (playerUid, styleName, runtimeStyle) {
        var client = Network.getClientForPlayer(playerUid);
        if (client) {
            client.send("packet.notification.send_".concat(this.type, "_notification"), { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    };
    /**
     * Method, calls with using close function.
     */
    Notification.prototype.onClose = function () { };
    ;
    /**
     * Method to close ui and call close events.
     */
    Notification.prototype.close = function () {
        if ("onClose" in this.currentStyle.events) {
            this.currentStyle.events.onClose(this);
        }
        this.onClose();
        this.UI.close();
        return;
    };
    /**
     * Method to call reach events.
     *
     */
    Notification.prototype.reach = function () {
        if ("onReach" in this.currentStyle.events) {
            this.currentStyle.events.onReach(this);
        }
        this.onReach();
        return;
    };
    /**
     * Method works when elements reaches need position.
     */
    Notification.prototype.onReach = function () { };
    ;
    /**
     * Method to get styled location
     * @param style style
     * @param x addition x value concating with main, optional
     * @param y addition y value concating with main, optional
     */
    Notification.getStyledLocation = function (style, x, y) {
        return {
            x: (x || 0) + style.window.x,
            y: (y || 0) + style.window.y,
            width: style.window.width * style.window.scale,
            height: style.window.height * style.window.scale
        };
    };
    /**
     * Method to get element set from your style
     * @param x addition x value concats to main, optional
     * @param y addition y value concats to main, optional
     * @param keyword word, adds to default key name, optional. If defined, after keyword `"_"` will be added
     * @returns default `UI.ElementSet`
     */
    Notification.getStyledElementSet = function (style, x, y, keyword) {
        var elements = {};
        for (var elementName in style.elements) {
            var description = style.elements[elementName];
            var element = __assign(__assign({}, description), { x: (x || 0) + description.x, y: (y || 0) + description.y });
            if ("preInit" in element) {
                element.preInit(element, style);
            }
            if ("text" in description) {
                var maxLineLength = description.lineSize || 25;
                var text = separateText(Translation.translate(description.text), maxLineLength);
                element.text = text;
                if (text.length > maxLineLength) {
                    element.multiline = true;
                }
            }
            if (description != null) {
                element.type = "slot";
                element.bitmap = "INotificationParams";
                element.source = {
                    id: typeof description.item == "string" ?
                        (ItemID[description.item] ||
                            VanillaItemID[description.item] ||
                            BlockID[description.item] ||
                            VanillaBlockID[description.item]) : description.item,
                    count: 1,
                    data: 0
                };
                element.iconScale = description.scale || 1;
            }
            if ("postInit" in element) {
                element.postInit(element, style);
            }
            elements[(keyword != null ? keyword + "_" : "") + elementName] = element;
        }
        return elements;
    };
    /**
     * Method to learn, exists type of notification or not.
     */
    Notification.has = function (type) {
        return type in this.list;
    };
    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement").
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param type type of the notification
     */
    Notification.get = function (type) {
        if (!Notification.has(type)) {
            throw new java.lang.NoSuchFieldException("Notification: type \"".concat(type, "\" of notification is not exists"));
        }
        return this.list[type];
    };
    /**
     * Method to register new notification with special type.
     * Throws `java.lang.SecurityException` if notification exists.
     * @param type keyword to register notification
     * @param notification object of notification
     */
    Notification.register = function (type, notification) {
        if (Notification.has(type)) {
            throw new java.lang.SecurityException("Notification: notification is already registered");
        }
        if (notification.type == null) {
            notification.type = type;
            notification.buildPacket();
        }
        return Notification.list[type] = notification;
    };
    /**
     * Method to learn is active type or not now.
     */
    Notification.isActive = function (type) {
        return Notification.get(type).lock;
    };
    /**
     * Method to get active types.
     * @returns active types of notifications
     */
    Notification.getActiveTypes = function () {
        var types = [];
        for (var i in Notification.list) {
            if (Notification.list[i].lock == true) {
                types.push(Notification.list[i]);
            }
        }
        return types;
    };
    /**
     * Method to init notification with special type.
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    Notification.init = function (type, styleName, runtimeStyle) {
        return Notification.get(type).init(styleName, runtimeStyle);
    };
    /**
     * Method to send client from server notification with specified style name and runtime data.
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param playerUid unique player identifier
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */
    Notification.sendFor = function (playerUid, type, styleName, runtimeStyle) {
        if (!Notification.has(type)) {
            throw new java.lang.NoSuchFieldException("Notification: type \"".concat(type, "\" of notification is not exists"));
        }
        var client = Network.getClientForPlayer(playerUid);
        if (client != null) {
            return client.send("packet.notification.send_".concat(type, "_notification"), { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    };
    /**
     * List of all notifications with special unique type.
     */
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
    screenName = name;
    if (name == "in_game_play_screen") {
        for (var i in Notification.list) {
            var notification = Notification.list[i];
            notification.initLast();
        }
    }
});
var NotificationStyles;
(function (NotificationStyles) {
    NotificationStyles.TRANSPARENT = {
        thread: {
            reachTime: 2000,
            queueTime: 1000
        },
        window: {
            scale: 2.3,
            width: 180,
            height: 20
        },
        elements: {
            text: {
                type: "text",
                x: 48,
                y: 15,
                font: {
                    color: android.graphics.Color.WHITE
                },
                lineSize: 30
            },
            icon: {
                type: "image",
                x: 8,
                y: 10
            }
        }
    };
})(NotificationStyles || (NotificationStyles = {}));
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
    TransparentNotification.prototype.postInit = function () {
        this.mark = false;
        this.UI.layout.setAlpha(0);
    };
    TransparentNotification.prototype.work = function () {
        var alpha = this.UI.layout.getAlpha();
        if (alpha < 1 && this.mark == false) {
            this.setAlpha(alpha + 0.01);
        }
        else {
            if (!this.mark) {
                this.mark = true;
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        }
        if (this.mark) {
            this.setAlpha(alpha - 0.01);
            if (alpha <= 0) {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
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
    AchievementNotification.prototype.updateElementsHeight = function (height) {
        var elements = this.UI.getElements();
        for (var name in this.defaultHeights) {
            elements.get(name).setPosition(this.UI.content.elements[name].x, height + this.defaultHeights[name]);
        }
    };
    AchievementNotification.prototype.setDefaultHeights = function () {
        this.defaultHeights = {};
        for (var i in this.UI.content.elements) {
            var element = this.UI.content.elements[i];
            this.defaultHeights[i] = element.y || 0;
        }
    };
    AchievementNotification.prototype.postInit = function () {
        this.maxHeight = this.currentStyle.window.height * this.currentStyle.window.scale;
        this.height = -this.maxHeight;
        this.mark = false;
        this.setDefaultHeights();
        this.updateElementsHeight(this.height);
    };
    AchievementNotification.prototype.work = function () {
        if (this.mark == false) {
            if (this.height < 0) {
                this.updateElementsHeight(this.height++);
            }
            else {
                this.mark = true;
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        }
        else {
            if (this.height > -this.maxHeight) {
                this.updateElementsHeight(this.height--);
            }
            else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();
                return true;
            }
        }
    };
    return AchievementNotification;
}(Notification));
Notification.register("achievement", new AchievementNotification())
    .addStyle("transparent", NotificationStyles.TRANSPARENT);
var AdvancementNotification = /** @class */ (function (_super) {
    __extends(AdvancementNotification, _super);
    function AdvancementNotification() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxOffset = 100;
        _this.mark = false;
        _this.offset = 0;
        return _this;
    }
    AdvancementNotification.prototype.setDefaultOffsets = function () {
        this.defaultOffsets = {};
        for (var i in this.UI.content.elements) {
            var element = this.UI.content.elements[i];
            this.defaultOffsets[i] = element.x || 0;
        }
    };
    AdvancementNotification.prototype.updateElementsOffset = function (offset) {
        var elements = this.UI.getElements();
        for (var name in this.defaultOffsets) {
            elements.get(name).setPosition(offset + this.defaultOffsets[name], this.UI.content.elements[name].y);
        }
    };
    AdvancementNotification.prototype.getSleepTime = function () {
        return 2;
    };
    AdvancementNotification.prototype.setContent = function () {
        //const style = this.getStyle(this.currentStyleName);
        var height = (this.currentStyle.window.height * this.currentStyle.window.scale)// * this.currentStyle.window.maxCount;
        var elements = Notification.getStyledElementSet(this.currentStyle);
        // let count = 1;
        // for(let i = 0; i < this.queue.length; i++) {
        //     const element = this.queue[i];
        //     if(element != null) {
        //         element.runtimeStyle.window = element.runtimeStyle.window || {};
        //     }
        //     if(
        //         count >= this.currentStyle.window.maxCount || 
        //         typeof element != "object" ||
        //         element.styleName != this.currentStyleName || 
        //         element.runtimeStyle.window.position != null && element.runtimeStyle.window.position != this.currentStyle.window.position || 
        //         element.runtimeStyle.window.width != null && element.runtimeStyle.window.width != this.currentStyle.window.width || 
        //         element.runtimeStyle.window.height != null && element.runtimeStyle.window.height != this.currentStyle.window.height || 
        //         element.runtimeStyle.window.scale != null && element.runtimeStyle.window.scale != this.currentStyle.window.scale
        //     ) {
        //         break;
        //     }
        //     const elementSet = Notification.getStyledElementSet(
        //         this.getCommonStyle(style, element.runtimeStyle), 0, height * count, String(i)
        //     );
        //     Object.assign(elements, elementSet);
        //     this.queue.splice(i, 1);
        //     i--;
        //     count++;
        // }
        // for(const i in elements) {
        //     if("height" in elements[i]) {
        //         elements[i].height = Math.min(elements[i].height, height / count);
        //     }
        // }
        this.UI.setContent({
            location: {
                x: this.currentStyle.window.x + (this.currentStyle.window.position == "left" ? 0 : 1000 - this.currentStyle.window.width * this.currentStyle.window.scale),
                y: this.currentStyle.window.y,
                width: this.currentStyle.window.width * this.currentStyle.window.scale,
                height: height
            },
            drawing: [{
                    type: "background",
                    color: this.currentStyle.window.color
                }],
            elements: elements
        });
        this.UI.forceRefresh();
    };
    AdvancementNotification.prototype.preInit = function (style, runtimeStyle) {
        _super.prototype.preInit.call(this, style, runtimeStyle);
        this.currentStyle.window.position = (runtimeStyle.window.position || style.window.position) || "right";
        this.currentStyle.window.maxCount = (runtimeStyle.window.maxCount || style.window.maxCount) || 4;
    };
    AdvancementNotification.prototype.postInit = function () {
        this.mark = false;
        this.maxOffset = this.currentStyle.window.width * this.currentStyle.window.scale;
        this.offset = this.currentStyle.window.position == "left" ? -this.maxOffset : this.maxOffset * 2;
        this.work = this.currentStyle.window.position == "left" ? this.animationLeft : this.animationRight;
        this.setDefaultOffsets();
        this.updateElementsOffset(this.offset);
    };
    AdvancementNotification.prototype.animationLeft = function () {
        if (this.mark == false) {
            if (this.offset < 0) {
                this.updateElementsOffset(this.offset += 2);
            }
            else {
                this.mark = true;
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        }
        else {
            if (this.offset > -this.maxOffset) {
                this.updateElementsOffset(this.offset -= 2);
            }
            else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();
                return true;
            }
        }
    };
    AdvancementNotification.prototype.animationRight = function () {
        if (this.mark == false) {
            if (this.offset > this.maxOffset) {
                this.updateElementsOffset(this.offset -= 2);
            }
            else {
                this.mark = true;
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        }
        else {
            if (this.offset < this.maxOffset * 2) {
                this.updateElementsOffset(this.offset += 2);
            }
            else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();
                return true;
            }
        }
    };
    AdvancementNotification.prototype.work = function () {
        return false;
    };
    return AdvancementNotification;
}(Notification));
Notification.register("advancement", new AdvancementNotification());
EXPORT("Notification", Notification);
EXPORT("TransparentNotification", TransparentNotification);
EXPORT("AchievementNotification", AchievementNotification);
EXPORT("AdvancementNotification", AdvancementNotification);

interface INotificationStyle {
    background: {
        bitmap: string
    },
    text: {
        default_x: number,
        default_y: number,
        font?: com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription,
        /**
         * width of text. If text length bigger then max_length, it will be cut
         */
        max_length: number
    }, 
    icon: {
        item: {
            /**
             * size of the icon when type is item
             */
            size: number,
            /**
             * x of the icon when type is item
             */
            default_x: number,
            /**
             * y of the icon when type is item
             */
            default_y: number
        },
        bitmap: {
            /**
             * x of the icon when type is bitmap
             */
            default_x: number,
            /**
             * y of the icon when type is bitmap
             */
            default_y: number,
            /**
             * width of the icon when type is bitmap
             */
            width: number,
            /**
             * height of the icon when type is bitmap
             */
            height: number
        }
    },
    /**
     * scale of all elements
     */
    scale: number,
    /**
     * time before moving back, in seconds
     */
    wait_time: number,
    /**
     * time before next notification, in seconds
     */
    queue_time: number,
    /**
     * width of window. Influences on background width
     */
    width: number,
    /**
     * height of window. Influences on background height
     */
    height: number
};

interface INotificationInputParams {
    style_name: string,
    text: string,
    icon: string,
    icon_type?: "item" | "default"
};

class Notification {
    public static styles: Record<string, INotificationStyle> = {};
    public static addStyle(name: string, style: INotificationStyle) {
        this.styles[name] = style;
    };

    private constructor() {};

    public static UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setDynamic(true);
        window.setTouchable(false);
        return window;
    })();

    public static queue: INotificationInputParams[] = [];
    public static lock: boolean = false;

    public static setDefault(style: INotificationStyle, text: string, icon: string, icon_type?: string) {
        const width = style.width * style.scale;
        const height = style.height * style.scale;

        const content = {
            location: {
                x: 10,
                y: 0,
                width,
                height
            },
            drawing: [{
                type: "background",
                color: android.graphics.Color.argb(0, 0, 0, 0)
            }],
            elements: {
                background: {
                    type: "image",
                    x: 0,
                    y: -height,
                    width,
                    height,
                    bitmap: style.background.bitmap
                },
                icon: (() => {
                    const content = {} as UI.UISlotElement | UI.UIImageElement;

                    if(icon_type && icon_type === "item") {
                        content.type = "slot";
                        content.x = style.icon.item.default_x * style.scale;
                        content.y = style.icon.item.default_y * style.scale;

                        content.source = new ItemStack(parseID(icon), 1, 0);
                        content.visual = true;
                        content.size = style.icon.item.size;
                        content.bitmap = "unknown";
                    } else {
                        content.type = "image";
                        content.x = style.icon.bitmap.default_x * style.scale;
                        content.y = style.icon.bitmap.default_y * style.scale;
                        
                        content.bitmap = icon;
                        content.width = style.icon.bitmap.width * style.scale;
                        content.height = style.icon.bitmap.height * style.scale;
                    };
                    
                    return content;
                })(),
                text: {
                    type: "text",
                    x: style.text.default_x * style.scale,
                    y: -height + (style.text.default_y * style.scale), 
                    text: (() => {
                        let newText = Translation.translate(text);

                        if(newText.length >= style.text.max_length) {
                            newText = newText.slice(0, style.text.max_length) + "...";
                        };

                        return newText
                    })(),
                    font: style.text.font || {
                        size: 20,
                        color: android.graphics.Color.BLACK,
                    }
                }
            }
        } satisfies UI.WindowContent;

        this.UI.setContent(content);
        this.UI.invalidateAllContent();

        return;
    };

    public static open(style_name: string, text: string, icon: string, icon_type?: "item" | "default"): void {
        if(this.lock) {
            this.queue.push({ style_name, text, icon, icon_type });
            return;
        };

        const style = this.styles[style_name];

        if(!style) {
            throw new NoSuchFieldException("Error with getting style: style is not exists");
        };

        this.lock = true;
        this.setDefault(style, text, icon, icon_type);

        if(!this.UI.isOpened()) {
            this.UI.open();
        };

        this.initAnimation(style, text, icon, icon_type);
        return;
    };

    public static updateElementHeights(style: INotificationStyle, icon_type: "item" | "default" ,value: number): void {
        const elements = this.UI.getElements();

        elements.get("background").setPosition(0, value);
        elements.get("text").setPosition(style.text.default_x * style.scale, value + style.text.default_y); 

        const key = icon_type === "item" ? "item" : "bitmap";

        elements.get("icon").setPosition(style.icon[key].default_x * style.scale, value + style.icon[key].default_y);
        return;
    };

    public static initAnimation(style: INotificationStyle, text: string, icon: string, icon_type?: "item" | "default"): void {
        const static_height = style.height * style.scale;
        let mark: boolean = false;
        let height: number = -static_height;

        Threading.initThread("thread.infinite_forest.notification", () => {
            while(true) {
                java.lang.Thread.sleep(3);
                if(!mark) {
                    if(height < 0) {
                        height += 1;
                        this.updateElementHeights(style, icon_type, height);
                    } else {
                        java.lang.Thread.sleep(style.wait_time * 1000);
                        mark = true;
                    };
                } else {
                    if(height > -static_height) {
                        height -= 1
                        this.updateElementHeights(style, icon_type, height);
                    } else {
                        this.lock = false;

                        if(this.queue.length > 0) {
                            java.lang.Thread.sleep(style.queue_time * 1000);

                            const notification = this.queue.shift();

                            this.open(notification.style_name, notification.text, notification.icon, notification.icon_type);
                            return;
                        };

                        this.UI.close();
                        return;
                    };
                };
            };
        });
        return;
    };

    public static sendFor(player_uid: number, style_name: string, text: string, icon: string, icon_type?: "item" | "default") {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send("packet.infinite_forest.send_notification", { style_name, text, icon, icon_type });
        };
    };
};

Network.addClientPacket("packet.infinite_forest.send_notification", (data: INotificationInputParams) => {
    return Notification.open(data.style_name, data.text, data.icon, data.icon_type);
});

Callback.addCallback("LocalLevelLeft", () => {
    Notification.queue = [];
});
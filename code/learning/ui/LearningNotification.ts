class LearningNotification {
    private constructor() {};

    public static SCALE: number = 2.5;
    public static WIDTH: number = 240 * this.SCALE;
    public static HEIGHT: number = 40 * this.SCALE;

    public static WAIT_TIME_MAX = 190;

    public static UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setDynamic(true);
        window.setTouchable(false);
        return window;
    })();

    public static wait_list: string[] = [];
    public static lock: boolean = false;

    public static setContentWith(learning: string) {
        const valid_learning = Learning.get(learning);

        if(!valid_learning) {
            throw new RuntimeException("Error with drawing learning notification ui: learning is not exists");
        };

        const content = {
            location: {
                x: 10,
                y: 0,
                width: this.WIDTH,
                height: this.HEIGHT
            },
            drawing: [{
                type: "background",
                color: android.graphics.Color.argb(0, 0, 0, 0)
            }],
            elements: {
                background: {
                    type: "image",
                    x: 0,
                    y: -this.HEIGHT,
                    width: this.WIDTH,
                    height: this.HEIGHT,
                    bitmap: "learning_notification"
                },
                image: (() => {
                    const x = 3 + (8 * this.SCALE);
                    const y = -this.HEIGHT + (this.HEIGHT / 4);
                    const height = 27 * this.SCALE;
                    const width = 27 * this.SCALE;

                    const isItemIcon = valid_learning.type.includes("item");

                    const content = {
                        type: isItemIcon ? "slot" : "image",
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                        ...(isItemIcon ? {
                            source: new ItemStack(parseID(valid_learning.icon), 1, 0),
                            visual: true,
                            iconScale: 1,
                            bitmap: "unknown"
                        } : {
                            bitmap: valid_learning.icon
                        })
                    } satisfies UI.UISlotElement | UI.UIImageElement;
                    return content;
                })(),
                text: {
                    type: "text",
                    x: 48 * this.SCALE,
                    y: -this.HEIGHT + (this.HEIGHT / 2.4), // 1.9
                    text: Translation.translate("message.infinite_forest.new_learning") + Translation.translate(`learning.infinite_forest.${valid_learning.name}`),
                    font: {
                        size: 20,
                        color: android.graphics.Color.BLACK
                    }
                }
            }
        } satisfies UI.WindowContent;

        this.UI.setContent(content);
        this.UI.forceRefresh();

        return;
    };

    public static open(learning: string): void {
        if(this.lock) {
            this.wait_list.push(learning);
            return;
        };

        this.lock = true;
        this.setContentWith(learning);

        if(!this.UI.isOpened()) {
            this.UI.open();
        };

        this.initAnimation();
        return;
    };

    public static updateElementHeights(value: number): void {
        const content = this.UI.getContent();

        content.elements.background.y = value;
        content.elements.text.y = value + (this.HEIGHT / 2.4); //1.8
        content.elements.image.y = value + (this.HEIGHT / 4);
        
        this.UI.forceRefresh();
        return;
    };

    public static initAnimation(): void {
        let mark: boolean = false;
        let timer: number = 0;
        let height: number = -this.HEIGHT;

        Threading.initThread("thread.infinite_forest.learning_notification", () => {
            while(true) {
                java.lang.Thread.sleep(5);
                if(!mark) {
                    
                    if(height < 0) {
                        height += 1;
                        this.updateElementHeights(height);
                    } else {
                        if(timer < this.WAIT_TIME_MAX) {
                            timer += 1;
                        } else {
                            mark = true;
                        };
                    };
                } else {

                    if(height > -this.HEIGHT && timer >= this.WAIT_TIME_MAX) {
                        height -= 1
                        this.updateElementHeights(height);
                    } else {
                        this.lock = false;

                        if(this.wait_list.length > 0) {
                            this.open(this.wait_list.shift());
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

    public static sendFor(player_uid: number, learning: string) {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send("packet.infinite_forest.send_learning_notification", { learning });
        };
    };
};

Translation.addTranslation("message.infinite_forest.new_learning", {
    en: "You learned: ",
    ru: "Вы изучили: ",
});

Callback.addCallback("ItemUse", (coords, item, block, isEx, player) => {
    if(item.id === VanillaItemID.arrow) {
        return LearningNotification.sendFor(player, "first_lucks")
    }
}); //todo: debug

Network.addClientPacket("packet.infinite_forest.send_learning_notification", (data: { learning: string }) => {
    LearningNotification.open(data.learning);
});
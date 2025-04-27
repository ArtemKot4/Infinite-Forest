class EffectHud {
    public static count: number = 1;
    public static BORDER_SCALE: number = 3.3;
    public static HORIZONTAL_POSITION: number = UI.getScreenHeight() / 2 + 195;
    public static VERTICAL_POSITION: number = 15;

    public lock: boolean = false;
    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setTouchable(false);

        return window;
    })();

    public constructor(
        public type: string,
        public icon?: string,
        public bitmapScale?: string,
        public backgroundScale?: string,
        public border?: string
    ) {}

    public getIcon(): string {
        return this.icon;
    }

    public getBitmapScale(): string {
        return this.bitmapScale;
    }

    public getBackgroundScale(): string {
        return this.backgroundScale;
    }

    public getBorder(): string {
        return "effect.border";
    }

    public getContent(): UI.WindowContent {
        return {
            location: {
                x: EffectHud.HORIZONTAL_POSITION,
                y: EffectHud.VERTICAL_POSITION + 25 * EffectHud.count
            },
            drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.argb(0, 0, 0, 0)
                },
                {
                    type: "bitmap",
                    bitmap: this.getBorder(),
                    scale: EffectHud.BORDER_SCALE,
                },
                {
                    type: "bitmap",
                    bitmap: this.getIcon(),
                    x: 10,
                    y: 5,
                    width: 9 * 3.7,
                    height: 9 * 3.7
                },
                {
                    type: "bitmap",
                    x: 50,
                    y: 8,
                    width: 76 * 3,
                    height: 9 * 3,
                    bitmap: this.getBackgroundScale() || "effect.default_scale_background"
                }
            ],
            elements: {
                scale: {
                    type: "scale",
                    x: 50,
                    y: 8,
                    width: 76 * 3,
                    height: 9 * 3,
                    direction: 0,
                    bitmap: this.getBitmapScale(),
                }
            }
        };
    }

    public open(): void {
        if(this.isOpened()) return;
        this.UI.setContent(this.getContent());
        this.UI.forceRefresh();
        this.UI.open();
        EffectHud.increaseCount();
        return;
    }

    public close(): void {
        this.lock = false;
        this.UI.close();
        EffectHud.decreaseCount();
    }

    public isOpened(): boolean {
        return this.UI.isOpened();
    }

    public setScale(value: number, max: number): void {
        this.UI.getElements().get("scale").setBinding("value", value / max);
        return;
    }

    public clear(): void {
        this.setScale(0, 0);

        if(this.isOpened()) {
            this.UI.layout.setAlpha(0);
        }
    }

    public init(playerUid: number): void {
        if(!ConfigManager.EFFECT_SCALE_IN_CREATIVE && PlayerUser.isCreative(Player.getLocal()) || this.lock) {
            return;
        }

        this.open();
        this.clear();

        Threading.initThread("thread.infinite_forest.effect_scale", () => {
            while(true) {
                    java.lang.Thread.sleep(50);

                    if(!this.isOpened()) {
                        continue;
                    }

                    const data = Effect.getFor(playerUid, this.type)
    
                    this.setScale(data.progress, data.progressMax);
    
                    const alpha = this.UI.layout.getAlpha();
                        
                    if(data.timer > 0) {
                        if(alpha < 1) {
                            this.UI.layout.setAlpha(alpha + 0.05);
                        }
                    }
    
                    if(data.timer <= 0 && data.progress <= 0) {
                        if(alpha > 0) {
                            this.UI.layout.setAlpha(alpha - 0.05);
                        } else {
                            this.close();
                            return;
                        }
                    }
                }
            }
        );
    }

    public static increaseCount() {
        this.count++;
    }

    public static decreaseCount() {
        this.count = Math.max(1, this.count-1);
    }
}

// Callback.addCallback("NativeGuiChanged", (screenName) => {
//     for(const name in Effect.clientData) {
//         const currentData = Effect.clientData[name];
//         if(currentData.progress <= 0) continue;

//         const currentHud = EffectHud.list[name];

//         if(screenName === "in_game_play_screen" || screenName === "death_screen") {
//             currentHud.open();    
//         } else {
//             currentHud.close();
//         };
//     };
// });
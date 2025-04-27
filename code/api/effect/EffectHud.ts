class EffectHud {
    public static count: number = 0;
    public static BORDER_SCALE: number = 3.3;
    public static HORIZONTAL_POSITION: number = UI.getScreenHeight() / 2 + 195;
    public static VERTICAL_POSITION: number = 15;

    public thread!: java.lang.Thread;
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
        const height = EffectHud.VERTICAL_POSITION + 50 * EffectHud.count;
        return {
            location: {
                x: EffectHud.HORIZONTAL_POSITION,
                y: 0
            },
            drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.TRANSPARENT
                }
            ],
            elements: {
                border: {
                    type: "image",
                    x: 0,
                    y: height,
                    bitmap: this.getBorder(),
                    scale: EffectHud.BORDER_SCALE
                },
                icon: {
                    type: "image",
                    bitmap: this.getIcon(),
                    x: 10,
                    y: height + 5,
                    width: 9 * 3.7,
                    height: 9 * 3.7
                },
                scale_background: {
                    type: "image",
                    x: 50,
                    y: height + 8,
                    width: 76 * 3,
                    height: 9 * 3,
                    bitmap: this.getBackgroundScale() || "effect.default_scale_background"
                },
                scale: {
                    type: "scale",
                    x: 50,
                    y: height + 8,
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

        EffectHud.increaseCount();
        this.UI.setContent(this.getContent());
        this.UI.forceRefresh();
        this.UI.open();
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

    public preventInit(playerUid: number): boolean {
        return !ConfigManager.EFFECT_SCALE_IN_CREATIVE && PlayerUser.isCreative(playerUid) || this.lock == true;
    }

    public onPreventInit(playerUid: number): void {};
    public onInit?(playerUid: number): void;
    public onThread?(playerUid: number, data: IEffectData): void;
    public onAppear?(playerUid: number, data: IEffectData): void;
    public onDisappear?(playerUid: number, data: IEffectData): void;
    public onClose?(playerUid: number, data: IEffectData): void;
    public onFull?(playerUid: number, data: IEffectData): void;

    public init(playerUid: number): void {
        if(this.preventInit(playerUid)) {
            return this.onPreventInit(playerUid);
        }

        if("onInit" in this) {
            this.onInit(playerUid);
        }

        this.open();
        this.clear();

        this.thread = Threading.initThread("thread.infinite_forest.effect_scale", () => this.threadFunction(playerUid, EffectHud.count));
    }

    public setHeight(height: number): void {
        const elements = this.UI.getElements();
        const border = elements.get("border");
        const icon = elements.get("icon");
        const scaleBackground = elements.get("scale_background");
        const scale = elements.get("scale");
        
        border.setPosition(border.x, height);
        icon.setPosition(icon.x, height + 5);
        scaleBackground.setPosition(scaleBackground.x, height + 8);
        scale.setPosition(scale.x, height + 8);
        return;
    }

    public isValidHeight(height: number, index: number): boolean {
        return height <= EffectHud.VERTICAL_POSITION + 50 * (index - 1);
    }

    public threadFunction(playerUid: number, index: number): void {
        let height = EffectHud.VERTICAL_POSITION + 50 * index;
        while(true) {
            java.lang.Thread.sleep(50);

            const data = Effect.getFor(playerUid, this.type);

            if(EffectHud.count < index) {
                if(!this.isValidHeight(height, index)) {
                    this.setHeight(height-=1)
                } else {
                    index--;
                }
            }

            this.setScale(data.progress, data.progressMax);

            if("onThread" in this) {
                this.onThread(playerUid, data);
            }

            if(data.progress >= data.progressMax) {
                if("onFull" in this) {
                    this.onFull(playerUid, data);
                }
            }

            const alpha = this.UI.layout.getAlpha();
                
            if(data.timer > 0) {
                if(alpha < 1) {
                    if("onAppear" in this) {
                        this.onAppear(playerUid, data);
                    }
                    this.UI.layout.setAlpha(alpha + 0.05);
                }
            }

            if(data.timer <= 0 && data.progress <= 0) {
                if(alpha > 0) {
                    if("onDisappear" in this) {
                        this.onDisappear(playerUid, data);
                    }
                    this.UI.layout.setAlpha(alpha - 0.05);
                } else {
                    if("onClose" in this) {
                        this.onClose(playerUid, data);
                    }
                    this.close();
                    return;
                }
            }
        }
    }

    public static increaseCount(): void {
        this.count++;
    }

    public static decreaseCount(): void {
        this.count = Math.max(0, this.count-1);
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

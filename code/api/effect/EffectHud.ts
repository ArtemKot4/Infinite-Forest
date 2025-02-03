class EffectHud {
    public static list: Record<string, EffectHud> = {};

    public static count: number = 1;

    public static increaseCount() {
        this.count++;
    };

    public static decreaseCount() {
        this.count = Math.max(1, this.count-1);
    };

    public constructor(
        public icon: string,
        public scale_bitmap: string,
        public scale_bitmap_background: string = "effect.default_scale_background") {
        EffectHud.list[icon] = this;
    };

    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setTouchable(false);

        return window;
    })();

    public container: UI.Container = new UI.Container();

    public static BORDER_SCALE: number = 3.3;

    public static HORIZONTAL_POSITION: number = UI.getScreenHeight() / 2 + 195;

    public static VERTICAL_POSITION: number = 15;

    public open(): void {
        const content = {
            location: {
                x: EffectHud.HORIZONTAL_POSITION,
                y: EffectHud.VERTICAL_POSITION + 20 * EffectHud.count
            },
            drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.argb(0, 0, 0, 0)
                },
                {
                    type: "bitmap",
                    bitmap: "effect.border",
                    scale: EffectHud.BORDER_SCALE,
                },
                {
                    type: "bitmap",
                    bitmap: this.icon,
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
                    bitmap: this.scale_bitmap_background
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
                    bitmap: this.scale_bitmap
                }
            }
        } satisfies UI.WindowContent;

        this.UI.setContent(content);
        this.UI.forceRefresh();

        if(!this.isOpened()) this.container.openAs(this.UI);
        EffectHud.increaseCount();
    };

    public close() {
        this.container.close();
        EffectHud.decreaseCount();
    };

    public isOpened(): boolean {
        return this.container.isOpened();
    };

    public setScale(value: number, max: number) {
        return this.container.setScale("scale", value / max);
    };

    public clear() {
        this.setScale(0, 0);

        if(this.isOpened()) {
            this.UI.layout.setAlpha(0);
        };
    };

    public init() {
        if(this.isOpened()) {
            return;
        };

        if(!ConfigManager.EFFECT_SCALE_IN_CREATIVE && Utils.isCreativePlayer(Player.getLocal())) {
            return;
        };

        this.open();
        this.clear();

        const self = this;
        

        Updatable.addLocalUpdatable({
            update() {        
                const data = Effect.clientData[self.icon];

                self.setScale(data.progress, data.progress_max);

                const alpha = self.UI.layout.getAlpha();
                    
                if(data.timer > 0) {

                    if(alpha < 1) {
                        self.UI.layout.setAlpha(alpha + 0.05);
                    };

                };

                if(data.timer <= 0 && data.progress <= 0) {

                    if(alpha > 0) {
                        self.UI.layout.setAlpha(alpha - 0.05);
                    } else {
                        self.close();
                        this.remove = true;
                    };

                };
            }
        });
        return;
    };
    
};
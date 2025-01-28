class EffectHud {
    public constructor(
        public icon: string, 
        public scale_bitmap: string, 
        public scale_bitmap_background: string = "effect.default_scale_background"
    ) {};

    public static UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setTouchable(false);

        return window;
    })();

    public static container: UI.Container = new UI.Container();

    public static BORDER_SCALE: number = 3.3;

    public static HORIZONTAL_POSITION: number = UI.getScreenHeight() / 2 + 195;

    public static VERTICAL_POSITION: number = 35;

    public static openWith(hud: EffectHud) {
        if(this.isOpened()) {
            return;
        };

        const content = {
            location: {
                // width: 400,
                // height: 200,
                x: this.HORIZONTAL_POSITION,
                y: this.VERTICAL_POSITION
            },
            drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.argb(0, 0, 0, 0)
                },
                {
                    type: "bitmap",
                    bitmap: "effect.border",
                    scale: this.BORDER_SCALE,
                },
                {
                    type: "bitmap",
                    bitmap: hud.icon,
                    x: 10,
                    y: 5,
                    scale: 3.7
                }

            ],
            elements: {
                scale: {
                    type: "scale",
                    x: 50,
                    y: 8,
                    scale: 3,
                    direction: 0,
                    bitmap: hud.scale_bitmap,
                    background: hud.scale_bitmap_background
                }
            }
        } satisfies UI.WindowContent;

        this.UI.setContent(content);
        this.UI.forceRefresh();

        this.container.openAs(this.UI);
    };

    public static isOpened(): boolean {
        return this.container.isOpened();
    };

    public static setScale(value: number, max: number) {
        this.container.setScale("scale", value / max);
    };

    public static clear() {
        this.setScale(0, 0);

        if(this.container.isOpened()) {
            this.UI.layout.setAlpha(0);
        };
    };
    
};
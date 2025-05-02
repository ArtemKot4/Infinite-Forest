IMPORT("EffectBar");

class ForestEffectHud extends EffectHud {
    public constructor(
        public type: string,
        public icon?: string,
        public bitmapScale?: string,
        public backgroundScale?: string,
        public border?: string
    ) {
        super(type);
    }

    public override preventInit(playerUid: number): boolean {
        return !ConfigManager.EFFECT_SCALE_IN_CREATIVE && PlayerUser.isCreative(playerUid) || this.lock == true;
    }

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

    public getLocation(): UI.WindowLocationParams {
        return {
            x: UI.getScreenHeight() / 2 + 195,
            y: 15
        }
    }

    public getElements(): UI.ElementSet {
        return {
            border: {
                type: "image",
                x: 0,
                y: 0,
                bitmap: this.getBorder(),
                scale: 3.3
            },
            icon: {
                type: "image",
                bitmap: this.getIcon(),
                x: 10,
                y: 5,
                width: 9 * 3.7,
                height: 9 * 3.7
            },
            scale_background: {
                type: "image",
                x: 50,
                y: 8,
                width: 76 * 3,
                height: 9 * 3,
                bitmap: this.getBackgroundScale() || "effect.default_scale_background"
            },
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
    }
}


Callback.addCallback("ItemUse", (c, i, b, isE, p) => {
    Effect.get("winter").init(p, 500, 5);
    Effect.get("fear").init(p, 500, 10);
    Effect.get("calming").init(p, 500, 15);
})
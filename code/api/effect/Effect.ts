abstract class Effect {
    public static TIMER_MAX: number = 5;

    public static PROGRESS_MAX: number = 100;

    abstract getHud(): EffectHud;

    abstract onTick(player: number): void;

    public timer: number = Effect.TIMER_MAX;

    public progress: number = 0;

    public isLocked: boolean = false;

    public init(player: number): void {

        this.timer = Effect.TIMER_MAX;

        if(this.isLocked) return;

        this.isLocked = true;

        this.progress = 0;

        EffectHud.openWith(this.getHud());        
        EffectHud.clear();

        const self = this;

        Updatable.addLocalUpdatable({
            update() {
                const time = World.getThreadTime();

                if(time % 20 === 0 && self.timer > 0) {
                    self.timer = self.timer - 1;
                };

                const alpha = EffectHud.UI.layout.getAlpha();

                if(self.timer > 0) {

                    if(alpha < 1) {
                        EffectHud.UI.layout.setAlpha(alpha + 0.05);
                    };

                    if(self.progress <= Effect.PROGRESS_MAX) {
                        EffectHud.setScale(self.progress);
                        self.progress += 1;
                    };

                };

                if(self.timer <= Math.floor(Effect.TIMER_MAX / 2) && self.progress > 0) {
                    EffectHud.setScale(self.progress);
                    self.progress -= 1;
                };

                if(self.timer <= 0 && self.progress <= 0) {

                    if(alpha > 0) {
                        EffectHud.UI.layout.setAlpha(alpha - 0.05);
                    } else {
                        EffectHud.container.close();
                    
                        self.isLocked = false;
                        this.remove = true;
                    };
                };
            }
        });

        Updatable.addUpdatable({
            update() {
                if(World.getThreadTime() % 60 === 0 && !self.isLocked) {
                    this.remove = true;
                };
   
                if(self.progress >= Effect.PROGRESS_MAX) {
                    return self.onTick(player);
                };
            }
        });

        return;
    };

};

class WinterEffect extends Effect {
    public override onTick(player: number): void {
        Entity.damageEntity(player, 1);
    };

    public override getHud(): EffectHud {
        return new EffectHud("effect.winter_icon", "effect.winter_scale");
    };
};

class EffectList {
    public static WINTER: WinterEffect = new WinterEffect();
};
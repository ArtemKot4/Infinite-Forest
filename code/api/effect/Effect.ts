interface IClientEffectData {
    timer: number;
    progress: number;
    progress_max: number;
}

abstract class Effect {
    public static list: Record<string, Effect> = {};

    public constructor() {
        Effect.list[this.getHud().icon] = this;
    };

    public static clientData: { [name: string]: IClientEffectData } = {};

    public static readonly TIMER_MAX: number = 5;

    abstract readonly progress_max: number;

    abstract getHud(): EffectHud;

    abstract onTick(player: number): void;

    public timer: number = Effect.TIMER_MAX;

    public progress: number = 0;

    public isLocked: boolean = false;

    public sendDataFor(player: number, progress_max: number): void {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                scale: this.getHud().icon,
                timer: this.timer,
                progress: this.progress,
                progress_max: progress_max
            });
        };
    };

    public openHudFor(player: number) {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                name: this.getHud().icon
            });
        };
        return;
    };

    public onInit?(player: number, progress_max: number): void;

    public onEnd?(player: number, progress_max: number): void;

    public init(player: number, unique_progress_max?: number): void {

        this.timer = Effect.TIMER_MAX;

        if(this.isLocked === true) {
            return;
        };

        this.isLocked = true;

        this.progress = 0;

        const progress_max = unique_progress_max ? Math.floor(unique_progress_max) : this.progress_max;

        if("onInit" in this) {
            this.onInit(player, progress_max)
        };

        this.sendDataFor(player, progress_max);
        this.openHudFor(player);

        const self = this;

        Updatable.addUpdatable({
            update() {
                self.sendDataFor(player, progress_max);

                const time = World.getThreadTime();

                if(time % 20 === 0 && self.timer > 0) {
                    self.timer -= 1;
                };

                if(self.timer > 0 && self.progress <= progress_max) {
                    self.progress += 1;
                };

                if(self.timer <= Math.floor(Effect.TIMER_MAX / 2) && self.progress > 0) {
                    self.progress -= 1;
                };
   
                if(self.progress >= progress_max) {
                    self.onTick(player);
                };

                if(time % 60 === 0 && self.timer <= 0 && self.progress <= 0) {
                    
                    if("onEnd" in this) {
                        this.onEnd(player, progress_max);
                    };

                    self.isLocked = false;
                    this.remove = true;
                };

                return;
            }
        });
    };

};

Network.addClientPacket("packet.infinite_forest.effect_data_sync_for_client", (data: { scale: string } & IClientEffectData) => {
    Effect.clientData[data.scale] = {
        timer: data.timer,
        progress: data.progress,
        progress_max: data.progress_max
    };
    return;
});

Network.addClientPacket("packet.infinite_forest.effect_scale_open", (data: { name: string }) => {
    return EffectHud.list[data.name].init();
});

Callback.addCallback("EntityDeath", (entity) => {
    if(Entity.getType(entity) === Native.EntityType.PLAYER) {
        for(const i in Effect.list) {
            const effect = Effect.list[i];
            effect.timer = 0;
            effect.progress = 0;
        };
    };
});
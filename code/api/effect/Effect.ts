abstract class Effect {
    public static list: Record<string, Effect> = {};

    public constructor() {
        Effect.list[this.getHud().icon] = this;
    };

    public static clientData: { [name: string]: IEffectData } = {};

    public static readonly TIMER_MAX: number = 5;

    abstract readonly progress_max: number;

    abstract getHud(): EffectHud;

    abstract onTick(player: number): void;

    public getFor(player_uid: number): IEffectData {
        return ObjectPlayer.getOrCreate(player_uid).getEffect(this.getHud().icon);
    };

    public sendDataFor(player: number, progress_max: number, data: IEffectData): void {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                scale: this.getHud().icon,
                timer: data.timer,
                progress: data.progress,
                progress_max: progress_max,
                isLocked: data.isLocked
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

    public onInit?(player_uid: number, progress_max: number): void;

    public onEnd?(player_uid: number, progress_max: number): void;

    public init(player_uid: number, unique_progress_max?: number): void {
        const name = this.getHud().icon;

        const player = ObjectPlayer.getOrCreate(player_uid);

        player.setEffect(name, {
            timer: Effect.TIMER_MAX
        });

        const effect = this.getFor(player_uid);

        if(effect.isLocked === true) {
            return;
        };

        const progress_max = unique_progress_max ? Math.floor(unique_progress_max) : this.progress_max;

        this.sendDataFor(player_uid, progress_max, effect);
        this.openHudFor(player_uid);

        player.setEffect(name, {
            isLocked: true,
            progress: 0
        });

        if("onInit" in this) {
            this.onInit(player_uid, progress_max);
        };

        const self = this;

        Updatable.addUpdatable({
            update() {
                self.sendDataFor(player_uid, progress_max, effect);

                const time = World.getThreadTime();

                if(time % 20 === 0 && effect.timer > 0) {
                    effect.timer -= 1;
                };

                if(effect.timer > 0 && effect.progress <= progress_max) {
                    effect.progress += 1;
                };

                if(effect.timer <= Math.floor(Effect.TIMER_MAX / 2) && effect.progress > 0) {
                    effect.progress -= 1;
                };
   
                if(effect.progress >= progress_max) {
                    self.onTick(player_uid);
                };

                if(time % 60 === 0 && effect.timer <= 0 && effect.progress <= 0) {
                    
                    if("onEnd" in this) {
                        self.onEnd(player_uid, progress_max);
                    };

                    effect.isLocked = false;
                    this.remove = true;
                };

                return;
            }
        });
    };

};

Network.addClientPacket("packet.infinite_forest.effect_data_sync_for_client", (data: { scale: string } & IEffectData) => {
    Effect.clientData[data.scale] = {
        timer: data.timer,
        progress: data.progress,
        progress_max: data.progress_max,
        isLocked: data.isLocked
    };
    return;
});

Network.addClientPacket("packet.infinite_forest.effect_scale_open", (data: { name: string }) => {
    return EffectHud.list[data.name].init();
});

Callback.addCallback("EntityDeath", (entity) => {
    if(Entity.getType(entity) === Native.EntityType.PLAYER) {
        for(const i in Effect.list) {

            ObjectPlayer.getOrCreate(entity)
            .setEffect(i, {
                timer: 0,
                progress: 0
            });

        };
    };
});
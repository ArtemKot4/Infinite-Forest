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

     /**
     * Server function to get effect object;
     */
     public static get(player_uid: number, name: string): IEffectData {
        const player = ObjectPlayer.get(player_uid);

        if(player) {
            return player.effectList[name] ??= {
                progress: 0,
                progress_max: 100,
                timer: 0
            };
        }
    };

    /**
     * Server function to update effect object;
     * @param name of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public static set(player_uid: number, name: string, data: Partial<IEffectData>) {
        const player = ObjectPlayer.get(player_uid);

        if(player) {
            const previousData = player.effectList[name] || {
                progress: 0,
                progress_max: 100,
                timer: 0
            } satisfies IEffectData;
    
            player.effectList[name] = Object.assign(previousData, data);
        };
        return;
    };

    protected sendDataFor(player: number, progress_max: number, data: IEffectData): void {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                scale: this.getHud().icon,
                timer: data.timer,
                progress: data.progress,
                progress_max: progress_max,
                lock: data.lock
            });
        };
    };

    protected openHudFor(player: number) {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                name: this.getHud().icon
            });
        };
        return;
    };

    protected onInit?(player_uid: number, progress_max: number): void;

    protected onEnd?(player_uid: number, progress_max: number): void;

    public init(player_uid: number, unique_progress_max?: number): void {
        const name = this.getHud().icon;

        Effect.set(player_uid, name, {
            timer: Effect.TIMER_MAX
        });

        const effect = Effect.get(player_uid, name);

        if(effect.lock === true) {
            return;
        };

        const progress_max = unique_progress_max ? Math.floor(unique_progress_max) : this.progress_max;

        this.sendDataFor(player_uid, progress_max, effect);
        this.openHudFor(player_uid);

        Effect.set(player_uid, name, {
            lock: true,
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

                    effect.lock = false;
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
        lock: data.lock
    };
    return;
});

Network.addClientPacket("packet.infinite_forest.effect_scale_open", (data: { name: string }) => {
    return EffectHud.list[data.name].init();
});

Callback.addCallback("EntityDeath", (entity) => {
    if(Entity.getType(entity) === Native.EntityType.PLAYER) {
        for(const i in Effect.list) {
            Effect.set(entity, i, {
                timer: 0,
                progress: 0
            });
        };
    };
});
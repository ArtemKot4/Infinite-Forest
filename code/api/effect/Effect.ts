abstract class Effect {
    public static list: Record<string, Effect> = {};

    public constructor() {
        Effect.list[this.getHud().icon] = this;
    }

    public static clientData: { [name: string]: IEffectData } = {};

    public static readonly TIMER_MAX: number = 5;

    abstract readonly progressMax: number;

    abstract getHud(): EffectHud;

    abstract onTick(player: number): void;

     /**
     * Server function to get effect object;
     */
     public static get(playerUid: number, name: string): IEffectData {
        const player = ObjectPlayer.get(playerUid);

        if(player) {
            return player.effectList[name] ??= {
                progress: 0,
                progressMax: 100,
                timer: 0
            };
        }
    }

    /**
     * Server function to update effect object;
     * @param name of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public static set(playerUid: number, name: string, data: Partial<IEffectData>) {
        const player = ObjectPlayer.get(playerUid);

        if(player) {
            const previousData = player.effectList[name] || {
                progress: 0,
                progressMax: 100,
                timer: 0
            } satisfies IEffectData;
    
            player.effectList[name] = Object.assign(previousData, data);
        }
        return;
    }

    protected sendDataFor(player: number, progressMax: number, data: IEffectData): void {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                scale: this.getHud().icon,
                timer: data.timer,
                progress: data.progress,
                progressMax: progressMax,
                lock: data.lock
            });
        }
    }

    protected openHudFor(player: number) {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                name: this.getHud().icon
            });
        }
        return;
    }

    protected onInit?(playerUid: number, progressMax: number): void;

    protected onEnd?(playerUid: number, progressMax: number): void;

    public init(playerUid: number, uniqueProgressMax?: number): void {
        const name = this.getHud().icon;

        Effect.set(playerUid, name, {
            timer: Effect.TIMER_MAX
        });

        const effect = Effect.get(playerUid, name);

        if(effect.lock === true) {
            return;
        }

        const progressMax = uniqueProgressMax ? Math.floor(uniqueProgressMax) : this.progressMax;

        this.sendDataFor(playerUid, progressMax, effect);
        this.openHudFor(playerUid);

        Effect.set(playerUid, name, {
            lock: true,
            progress: 0
        });

        if("onInit" in this) {
            this.onInit(playerUid, progressMax);
        }

        const self = this;

        Updatable.addUpdatable({
            update() {
                self.sendDataFor(playerUid, progressMax, effect);

                const time = World.getThreadTime();

                if(time % 20 === 0 && effect.timer > 0) {
                    effect.timer -= 1;
                }

                if(effect.timer > 0 && effect.progress <= progressMax) {
                    effect.progress += 1;
                }

                if(effect.timer <= Math.floor(Effect.TIMER_MAX / 2) && effect.progress > 0) {
                    effect.progress -= 1;
                }
   
                if(effect.progress >= progressMax) {
                    self.onTick(playerUid);
                }

                if(time % 60 === 0 && effect.timer <= 0 && effect.progress <= 0) {
                    
                    if("onEnd" in this) {
                        self.onEnd(playerUid, progressMax);
                    }

                    effect.lock = false;
                    this.remove = true;
                }

                return;
            }
        });
    }
}

Network.addClientPacket("packet.infinite_forest.effect_data_sync_for_client", (data: { scale: string } & IEffectData) => {
    Effect.clientData[data.scale] = {
        timer: data.timer,
        progress: data.progress,
        progressMax: data.progressMax,
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
        }
    }
});
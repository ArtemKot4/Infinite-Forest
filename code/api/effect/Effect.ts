abstract class Effect {
    public static clientData: { [name: string]: IEffectData } = {};
    public static list: Record<string, Effect> = {};
    public static readonly TIMER_MAX: number = 5;

    public abstract readonly progressMax: number;

    protected abstract getType(): string;
    abstract getHud(): EffectHud;

    protected abstract onTick(playerUid: number): void;
    
    public static register(effect: Effect): Effect {
        return Effect.list[effect.getType()] = effect;
    }

    public static get(type: string): Nullable<Effect> {
        return Effect.list[type] || null;
    }

    /**
     * Server function to update effect object;
     * @param name of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public static setFor(playerUid: number, name: string, data: Partial<IEffectData>) {
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

    protected sendDataFor(playerUid: number, progressMax: number, data: IEffectData): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                scale: this.getType(),
                timer: data.timer,
                progress: data.progress,
                progressMax: progressMax,
                lock: data.lock
            });
        }
    }

    protected initHudFor(playerUid: number) {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                name: this.getType()
            });
        }
        return;
    }

    protected onPreTick?(playerUid: number, progressMax: number): void;

    protected onInit?(playerUid: number, progressMax: number): void;

    protected onEnd?(playerUid: number, progressMax: number): void;

    public init(playerUid: number, uniqueProgressMax?: number, timerMax?: number): void {
        timerMax = timerMax || Effect.TIMER_MAX;
        const name = this.getType();

        Effect.setFor(playerUid, name, {
            timer: timerMax
        });

        const effect = Effect.getFor(playerUid, name);

        if(effect.lock === true) {
            return;
        }

        const progressMax = uniqueProgressMax ? Math.ceil(uniqueProgressMax) : this.progressMax;

        this.sendDataFor(playerUid, progressMax, effect);
        this.initHudFor(playerUid);

        Effect.setFor(playerUid, name, {
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

                if(effect.timer <= Math.floor(timerMax / 2) && effect.progress > 0) {
                    effect.progress -= 1;
                }
   
                if(effect.progress >= progressMax) {
                    self.onTick(playerUid);
                } else {
                    if("onPreTick" in self) {
                        self.onPreTick(playerUid, progressMax);
                    }
                }

                if(time % 60 === 0 && effect.timer <= 0 && effect.progress <= 0) {
                    if("onEnd" in this) {
                        self.onEnd(playerUid, progressMax);
                    }

                    this.remove = true;
                    effect.lock = false;
                    return self.sendDataFor(playerUid, progressMax, effect);
                }
            }
        });
    }

    /**
     * Server function to get effect object;
     */
    public static getFor(playerUid: number, name: string): IEffectData {
        const player = ObjectPlayer.get(playerUid);

        if(player) {
            return player.effectList[name] ??= {
                progress: 0,
                progressMax: 100,
                timer: 0
            };
        }
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
    return Effect.list[data.name].getHud().init();
});

Callback.addCallback("EntityDeath", (entity) => {
    if(Entity.getType(entity) === Native.EntityType.PLAYER) {
        for(const i in Effect.list) {
            Effect.setFor(entity, i, {
                timer: 0,
                progress: 0,
                lock: false
            });
        }
    }
});
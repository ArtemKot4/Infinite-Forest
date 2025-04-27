abstract class Effect {
    public static clientData: { [type: string]: IEffectData } = {};
    public static list: Record<string, Effect> = {};
    public readonly timerMax?: number;
    public abstract readonly progressMax: number;

    protected abstract getType(): string;
    abstract getHud(): EffectHud;

    protected abstract onFull(playerUid: number): void;
    
    public static register(effect: Effect): Effect {
        return Effect.list[effect.getType()] = effect;
    }

    public static get(type: string): Nullable<Effect> {
        return Effect.list[type] || null;
    }

    /**
     * Server function to update effect object;
     * @param type of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public static sendFor(playerUid: number, type: string, data: Partial<IEffectData>) {
        const client = Network.getClientForPlayer(playerUid);

        if(client) {
            client.send("packet.infinite_forest.effect_data_sync_for_client", {
                type: type,
                playerUid: playerUid,
                effectData: data
            });
        }
        return;
    }

    public static setFor(playerUid: number, type: string, data: Partial<IEffectData>): void {
        const player = ObjectPlayer.get(playerUid);

        if(player) {
            const previousData = player.effectList[type] || {
                progress: 0,
                progressMax: 100,
                timer: 0
            } satisfies IEffectData;
    
            player.effectList[type] = Object.assign(previousData, data);
        }
    }


    protected initFor(playerUid: number): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                type: this.getType()
            });
        }
    }

    protected onIncrease?(playerUid: number, progressMax: number, timerMax: number): void;
    protected onDecrease?(playerUid: number, progressMax: number, timerMax: number): void;
    protected onInit?(playerUid: number, progressMax: number, timerMax: number): void;
    protected onEnd?(playerUid: number, progressMax: number, timerMax: number): void;

    public init(playerUid: number, progressMax?: number, timerMax?: number): void {
        timerMax = timerMax || this.timerMax || 5;
        const type = this.getType();

        Effect.setFor(playerUid, type, {
            timer: timerMax
        });

        if(Effect.getFor(playerUid, type).lock === true) {
            return;
        }

        progressMax = progressMax ? Math.ceil(progressMax) : this.progressMax;

        Effect.setFor(playerUid, type, {
            lock: true,
            timerMax: timerMax,
            progress: 0,
            progressMax: progressMax
        });

        this.initFor(playerUid);

        if("onInit" in this) {
            this.onInit(playerUid, progressMax, timerMax);
        }

        const self = this;

        Updatable.addUpdatable({
            update() {
                const time = World.getThreadTime();
                const effect = Effect.getFor(playerUid, type);

                if(time % 20 === 0 && effect.timer > 0) {
                    effect.timer -= 1;
                }

                if(effect.timer > 0 && effect.progress <= progressMax) {
                    effect.progress += 1;

                    if("onIncrease" in self) {
                        self.onIncrease(playerUid, progressMax, timerMax);
                    }
                }

                if(effect.timer <= Math.floor(timerMax / 2) && effect.progress > 0) {
                    if("onDecrease" in self) {
                        self.onDecrease(playerUid, progressMax, timerMax);
                    }
                    
                    effect.progress -= 1;
                }
   
                if(effect.progress >= progressMax) {
                    self.onFull(playerUid);
                }

                if(time % 60 === 0 && effect.timer <= 0 && effect.progress <= 0) {
                    if("onEnd" in this) {
                        self.onEnd(playerUid, progressMax, timerMax);
                    }

                    effect.lock = false;
                    this.remove = true;
                }
                Effect.sendFor(playerUid, type, effect);
            }
        });
    }

    /**
     * Server function to get effect object;
     */
    public static getFor(playerUid: number, type: string): Nullable<IEffectData> {
        const player = ObjectPlayer.get(playerUid);

        if(player) {
            return player.effectList[type] ??= {
                progress: 0,
                progressMax: 100,
                timer: 0
            };
        }
        return null;
    }
}

Network.addClientPacket("packet.infinite_forest.effect_data_sync_for_client", (data: { type: string, playerUid: number, effectData: IEffectData }) => {
    Effect.setFor(data.playerUid, data.type, data.effectData);
});

Network.addClientPacket("packet.infinite_forest.effect_scale_open", (data: { type: string, playerUid: number }) => {
    return Effect.list[data.type].getHud().init(data.playerUid);
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
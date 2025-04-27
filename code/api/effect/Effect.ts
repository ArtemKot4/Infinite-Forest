abstract class Effect {
    public static clientData: { [type: string]: IEffectData } = {};
    public static list: Record<string, Effect> = {};
    public readonly timerMax?: number;
    public abstract readonly progressMax: number;
    
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

    protected abstract getType(): string;
    public abstract getHud(): EffectHud;
    protected abstract onFull(playerUid: number, data: IEffectData): void;
    protected onIncrease?(playerUid: number, data: IEffectData): void;
    protected onDecrease?(playerUid: number, data: IEffectData): void;
    protected onInit?(playerUid: number, data: IEffectData): void;
    protected onEnd?(playerUid: number, data: IEffectData): void;

    protected initFor(playerUid: number): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.infinite_forest.effect_scale_open", {
                type: this.getType()
            });
        }
    }

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
            this.onInit(playerUid, Effect.getFor(playerUid, type));
        }

        const self = this;

        Updatable.addUpdatable({
            update() {
                const time = World.getThreadTime();
                const effectData = Effect.getFor(playerUid, type);

                if(time % 20 === 0 && effectData.timer > 0) {
                    effectData.timer -= 1;
                }

                if(effectData.timer > 0 && effectData.progress <= progressMax) {
                    effectData.progress += 1;

                    if("onIncrease" in self) {
                        self.onIncrease(playerUid, effectData);
                    }
                }

                if(effectData.timer <= Math.floor(timerMax / 2) && effectData.progress > 0) {
                    if("onDecrease" in self) {
                        self.onDecrease(playerUid, effectData);
                    }

                    effectData.progress -= 1;
                }
   
                if(effectData.progress >= progressMax) {
                    self.onFull(playerUid, effectData);
                }

                if(time % 60 === 0 && effectData.timer <= 0 && effectData.progress <= 0) {
                    if("onEnd" in this) {
                        self.onEnd(playerUid, effectData);
                    }

                    effectData.lock = false;
                    this.remove = true;
                }
                Effect.sendFor(playerUid, type, effectData);
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

// Callback.addCallback("NativeGuiChanged", (screenName: string) => {
//     const player = Player.getLocal();
//     if(player == -1) {
//         return;
//     }

//     for(const effectType in Effect.list) {
//         const effect = Effect.getFor(player, effectType);
//         if(effect.lock == true) {
//             const hud = Effect.list[effectType].getHud();
   
//             if(screenName == EScreenName.IN_GAME_PLAY_SCREEN) {
//                 if(hud.lock == true && !hud.isOpened()) {
//                     return hud.open();
//                 }
//             } else {
//                 if(hud.isOpened()) {
//                     return hud.close();
//                 }
//             }
//         }
//     }
// });
interface IEffectCommandParams extends ICommandParams {
    action: string
    effectType: string
    progressMax: number
    timerMax: number
}

class EffectCommand extends ServerCommand<IEffectCommandParams> {
    public constructor() {
        super("if:effect", {
            action: "string",
            effectType: "string",
            progressMax: "number",
            timerMax: "number"
        }, 3);
    }

    public onServer(client: NetworkClient, data: IEffectCommandParams): void {
        if(client == null) return;
        const playerUid = client.getPlayerUid();
        const effect = Effect.get(data.effectType);
        
        if(effect == null) {
            return client.sendMessage(Native.Color.RED + Translation.translate("message.infinite_forest.not_exists_effect").replace("%s", data.effectType));
        };

        switch(data.action) {
            case "set": {
                effect.init(playerUid, data.progressMax || effect.progressMax, data.timerMax || Effect.TIMER_MAX);
                return client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.effect_successfully_set").replace("%s", data.effectType));
            }
            case "clear": {
                Effect.setFor(playerUid, data.effectType, {
                    timer: 0,
                    progress: 0,
                    lock: false
                });
                return client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.effect_successfully_remove").replace("%s", data.effectType));
            }
        }
    }
}

Translation.addTranslation("message.infinite_forest.not_exists_effect", {
    en: "Effect %s not exists",
    ru: "Эффект %s не существует"
});

Translation.addTranslation("message.infinite_forest.effect_successfully_set", {
    en: "Effect %s successfully set",
    ru: "Эффект %s успешно установлен"
});

Translation.addTranslation("message.infinite_forest.effect_successfully_remove", {
    en: "Effect %s successfully cleared",
    ru: "Эффект %s успешно очищен"
});
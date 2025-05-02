// interface IEffectCommandParams extends ICommandParams {
//     action: string
//     effectType: string
//     progressMax: number
//     timerMax: number
// }

// class EffectCommand extends ServerCommand<IEffectCommandParams> {
//     public constructor() {
//         super("if:effect", {
//             action: "string",
//             effectType: "string",
//             progressMax: "number",
//             timerMax: "number"
//         }, 1);
//     }

//     public onServer(client: NetworkClient, data: IEffectCommandParams): void {
//         if(client == null) return;
//         const playerUid = client.getPlayerUid();
//         const effect = Effect.get(data.effectType);

//         if(!new PlayerActor(playerUid).isOperator()) {
//             return client.sendMessage(Native.Color.RED + Translation.translate("message.fireflies.not_allowed"));
//         }

//         switch(data.action) {
//             case "set": {
//                 if(effect == null) {
//                     return client.sendMessage(Native.Color.RED + Translation.translate("message.infinite_forest.not_exists_effect").replace("%s", data.effectType));
//                 }

//                 effect.init(playerUid, data.progressMax || effect.progressMax, data.timerMax || effect.timerMax);
//                 return client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.effect_successfully_set").replace("%s", data.effectType));
//             }
//             case "clear": {
//                 const clearObj = {
//                     timer: 0,
//                     progress: 0,
//                     lock: false
//                 };

//                 if(!data.effectType) {
//                     for(const effectType in Effect.list) {
//                         Effect.setFor(playerUid, effectType, clearObj);
//                         Effect.sendFor(playerUid, effectType, clearObj);
//                         client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.effect_successfully_remove").replace("%s", effectType));
//                     }
//                     return;
//                 }
//                 Effect.setFor(playerUid, data.effectType, clearObj);
//                 Effect.sendFor(playerUid, data.effectType, clearObj);
//                 client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.effect_successfully_remove").replace("%s", data.effectType));
//                 return;
//             }
//         }
//     }
// }

// new EffectCommand();

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

Translation.addTranslation("message.fireflies.not_allowed", {
    en: "Not allowed",
    ru: "Нет доступа"
})
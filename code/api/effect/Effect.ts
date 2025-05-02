

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

// Callback.addCallback("ItemUse", (c,i,b,isE, p) => {
//     Effect.get("winter").init(p, 250, 5);
//     Effect.get("fear").init(p, 250, 10);
//     Effect.get("calming").init(p, 250, 15); 
// })
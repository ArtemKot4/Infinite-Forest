Callback.addCallback("ServerPlayerLoaded", (playerUid) => {
    for(let effectType in Effect.list) {
        const effect = Effect.getFor(playerUid, effectType);
        if(effect.progress > 0) {
            effect.lock = false;
            Effect.get(effectType).init(playerUid, effect.progressMax, effect.timerMax);
        }
    }
});

// Network.addServerPacket("packet.infinite_forest.first_point", (client, data: {}) => {
//     if(!client) return;
//     const player = client.getPlayerUid();
    
//     if(Entity.getDimension(player) === InfiniteForest.id) {
//         ObjectPlayer.addLearning(player, LearningList.FIRST_POINT.name);
//     };
// });

// Callback.addCallback("DimensionLoaded", (currentId, lastId) => {
//     if(currentId === InfiniteForest.id) {
//         Network.sendToServer("packet.infinite_forest.first_point", {});
//     };
// });
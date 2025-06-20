Callback.addCallback("ServerPlayerLoaded", (playerUid) => {
    const client = Network.getClientForPlayer(playerUid);
    for(let effectType in Effect.list) {
        const effect = Effect.getFor(playerUid, effectType);
        if(effect.lock === true && effect.timer > 0 && effect.progress > 0) {
            effect.lock = false;
            if(client != null) {
                client.send("packet.infinite_forest.effect_hud_unlock", { effectType });
            }
            Effect.get(effectType).init(playerUid, effect.progressMax, effect.timerMax);
        }
    }
    if(InfiniteForest.data.vinePos.length > 0 && client != null) {
        client.send("packet.infinite_forest.client_vine_data", InfiniteForest.data.vinePos);
    }
});

Network.addClientPacket("packet.infinite_forest.effect_hud_unlock", (data: { effectType: string }) => {
    Effect.get(data.effectType).getHud().lock = false;
});

Network.addClientPacket("packet.infinite_forest.client_vine_data", (data: [number, number]) => {
    InfiniteForest.data.vinePos = data;
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
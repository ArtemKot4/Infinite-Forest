// Callback.addCallback("ServerPlayerLoaded", (player) => {
//     ObjectPlayer.addLearning(player, LearningList.STRANGE_DREAM.name);
// });

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
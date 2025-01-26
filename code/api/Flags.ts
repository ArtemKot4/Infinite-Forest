Callback.addCallback("ServerPlayerLoaded", (player) => {
    ObjectPlayer.create(player);
    ObjectPlayer.sendToClient(player);
});

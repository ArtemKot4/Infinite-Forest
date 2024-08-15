
Callback.addCallback("ServerPlayerTick", (playerUid, isPlayerDead) => {
  const entity = new PlayerEntity(playerUid);
  const carriedItem = entity.getCarriedItem();
  const inventoryItem = entity.getInventorySlot(entity.getSelectedSlot());
  if (World.getThreadTime() % 8 === 0) {
    checkHandItem(playerUid, carriedItem, inventoryItem);
  }
  if (World.getThreadTime() % 30 === 0) {
    if (
      Entity.getSneaking(playerUid) &&
      carriedItem.id === ItemID["insight_eye"] &&
      inventoryItem.id === ItemID["insight_eye"]
    ) {
      visionMode = true;
      ServerPlayer.setFlag(playerUid, "insightMode");
    } else {
      visionMode = false;
      ServerPlayer.deleteFlag(playerUid, "insightMode");
    }
  }
  return;
});


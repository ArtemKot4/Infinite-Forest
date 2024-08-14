const INFINITE_SHARK = new FItem("infinite_shark", 1, "Infinite shark", ["infinity_fragment", 8, 1]);

const CURSED_BLADE = new FItem("cursed_blade", 1, null, [
  "cursed_blade",
  [0, 1, 2, 3, 2, 1, 0, 0],
  1,
]);

const BROKEN_CURSED_BLADE = new FItem("broken_cursed_blade", 1, null, "broken_cursed_blade", 0, true)

CURSED_BLADE.setTool(
  {
    durability: 1200,
    level: 2,
    efficiency: 3,
    damage: 12
  },
  ToolType.sword,
  BROKEN_CURSED_BLADE.getID()
);

CURSED_BLADE.registerHandFunction(iceItemProtectFunction);

function hasCursedBlade(playerEntity: PlayerEntity) {
  return (
    playerEntity.getCarriedItem().id === CURSED_BLADE.getID() &&
    playerEntity.getInventorySlot(playerEntity.getSelectedSlot()).id ===
      CURSED_BLADE.getID()
  );
}

Callback.addCallback(
  "PlayerAttack",
  (player, victim) => {
    if (hasCursedBlade(new PlayerEntity(player))) {
      const pos = Entity.getPosition(player);
      const victimPos = Entity.getPosition(victim);
      if (
        ForestBiomes.ForestBiome.getState(World.getBiome(pos.x, pos.z)) ===
        EForestState.ICE
      ) {
        ColdCurse.runSnow(victimPos.x, victimPos.y + 2.5, victimPos.z, 0.5, 16) //TODO: DEBUG
        Entity.damageEntity(victim, 4);
        return;
      }
    }
  }
);

Callback.addCallback("EntityInteract", (entity, player, coords) => {
  const playerEntity = new PlayerEntity(player);
  const carriedItem = playerEntity.getCarriedItem();
  if (hasCursedBlade(playerEntity)) {
    alert("Сработало");
    Entity.damageEntity(entity, 2);
    Entity.addEffect(
      entity,
      EPotionEffect.MOVEMENT_SLOWDOWN,
      4,
      60,
      false,
      false
    );
    playerEntity.setInventorySlot(
      playerEntity.getSelectedSlot(),
      carriedItem.id,
      carriedItem.count,
      carriedItem.data > 1 ? carriedItem.data + 2 : carriedItem.data + 1
    );
  }
});
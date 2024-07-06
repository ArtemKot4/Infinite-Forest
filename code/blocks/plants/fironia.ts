Plants.registry("fironia", "fironia", BLOCK_TYPE_FIRE);
breakBlockIfAir(EForestPlants.FIRONIA);

Block.setAnimateTickCallback(EForestPlants.FIRONIA, (x, y, z, id, data) => {
  return fireParticle(x, y, z);
});

Block.registerClickFunctionForID(
  EForestPlants.FIRONIA,
  (coords, item, block, player) => {
    if (Game.getGameMode() === EGameMode.CREATIVE) return;
    Entity.setFire(player, 3, false);
  }
);

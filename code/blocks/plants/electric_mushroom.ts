Plants.registry("electric_mushroom", "electric_mushroom", BLOCK_TYPE_ELECTRIC);

breakBlockIfAir(EForestPlants.ELECTRIC_MUSHROOM);

Block.setTempDestroyTime(EForestPlants.ELECTRIC_MUSHROOM, 20 * 60);

class Mushroom extends TileEntityBase {
  public static particle(that, y = 0.4) {
    Particles.addParticle(
      EForestParticle.ELECTRIC,
      that.x + 0.5,
      that.y + y,
      that.z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20
    );
  }
  clientTick(): void {
    if (World.getThreadTime() % 10 === 0) {
      Mushroom.particle(this);
      Mushroom.particle(this);
      Mushroom.particle(this);
    }
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ) {
    return electric_damage(player);
  }
}

TileEntity.registerPrototype(EForestPlants.ELECTRIC_MUSHROOM, new Mushroom());

Block.setRandomTickCallback(
  VanillaBlockID.brown_mushroom,
  (x, y, z, id, data) => {
    const region = BlockSource.getDefaultForDimension(InfiniteForest.id);
    if (!region) return;
    if (World.getWeather().rain === 1 && region.getLightLevel(x, y, z) >= 10) {
      region.spawnEntity(x, y, z, EEntityType.LIGHTNING_BOLT);
      region.explode(x, y, z, 0, false);
      TileEntity.destroyTileEntityAtCoords(x, y, z, region);
      region.setBlock(x, y, z, EForestPlants.ELECTRIC_MUSHROOM, 0);
      TileEntity.addTileEntity(x, y, z, region);
    }
  }
);

const electric_damage = (player) => {
  if (Game.getGameMode() === EGameMode.CREATIVE) return;
  const pos = Entity.getPosition(player);
  return Entity.damageEntity(player, 5);
};

Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
  if (block.id == EForestPlants.ELECTRIC_MUSHROOM) {
    return electric_damage(Player.get());
  }
});

type CustomProjectileFunc = (
  x: int,
  y: int,
  z: int,
  block: int,
  region: BlockSource
) => void;

abstract class Projectiles {
  public static list: { block: int; func: CustomProjectileFunc }[] = [];
  public static breakBlock(block: int, func: CustomProjectileFunc = null) {
    Projectiles.list.push({ block, func });
  };
}

Callback.addCallback("ProjectileHit", function (projectile, item, target) {
  if (Entity.getType(projectile) === Native.EntityType.SNOWBALL) return;
  const region = BlockSource.getDefaultForActor(projectile);
  for (const block of Projectiles.list) {
    if (
      region.getBlockId(target.coords.x, target.coords.y, target.coords.z) ===
      block.block
    ) {
      region.destroyBlock(
        target.coords.x,
        target.coords.y,
        target.coords.z,
        false
      );
      if (!!block.func) {
        return block.func(
          target.coords.x,
          target.coords.y,
          target.coords.z,
          block.block,
          region
        );
      }
    }
  }
});

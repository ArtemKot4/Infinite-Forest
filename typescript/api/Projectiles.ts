type CustomProjectileFunc = (
  x: int,
  y: int,
  z: int,
  block: int,
  region: BlockSource
) => void;

abstract class Projectiles {
  public static list: {
    block: int;
    func: CustomProjectileFunc;
    tag?: "detect" | "break";
  }[] = [];
  public static breakBlock(block: int, func: CustomProjectileFunc = null) {
    Projectiles.list.push({ block, func, tag: "break" });
  }
  public static detect(block: int, func: CustomProjectileFunc) {
    Projectiles.list.push({ block, func, tag: "detect" });
  }
}

Callback.addCallback("ProjectileHit", function (projectile, item, target) {
  if (
    Entity.getType(projectile) === Native.EntityType.SNOWBALL ||
    Entity.getType(projectile) === Native.EntityType.EGG
  )
    return;
  const region = BlockSource.getDefaultForActor(projectile);
  for (const block of Projectiles.list) {
    if (
      region.getBlockId(target.coords.x, target.coords.y, target.coords.z) ===
      block.block
    ) {
      if (block.tag === "break") {
        region.destroyBlock(
          target.coords.x,
          target.coords.y,
          target.coords.z,
          false
        );
      }
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

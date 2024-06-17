namespace Plants {
  export const block_list = [
    VanillaBlockID.dirt,
    VanillaBlockID.podzol,
    VanillaBlockID.grass,
    VanillaBlockID.grass_path,
    VanillaBlockID.mycelium,
  ]
  export function registry(
    id: string,
    texture: string,
    type = BLOCK_TYPE_PLANT
  ) {
    new FBlock(
      id,
      [
        {
          name: id,
          texture: [[texture, 0]],
          inCreative: true,
        },
      ],
      type
    ).create();
    const render = new ICRender.Model();
    const model = BlockRenderer.createModel();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();
    entry.addBox(0, 0, 0, 0, 0, 0);
    BlockRenderer.setCustomCollisionShape(BlockID[id], -1, shape);
    render.addEntry(model);

   breakBlockIfAir(BlockID[id]);

    
  }
}

Plants.registry("electric_mushroom", "electric_mushroom", BLOCK_TYPE_ELECTRIC);

Plants.registry("fironia", "fironia", BLOCK_TYPE_FIRE);

Plants.registry("ice_flower", "ice_flower");

enum EForestPlants {
  ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
  FIRONIA = BlockID["fironia"],
  ICE_FLOWER = BlockID["ice_flower"]
}

Block.setTempDestroyTime(EForestPlants.ELECTRIC_MUSHROOM, 20 * 60);

const electric_damage = (player) => {
  if (Game.getGameMode() === EGameMode.CREATIVE) return;
  const pos = Entity.getPosition(player);
  return (
    Entity.damageEntity(player, 5),
    Game.tipMessage(
      Native.Color.BLUE + Translation.translate("Electric pain!")
    ),
    ForestParticle.send(
      EForestParticle.ELECTRIC,
      pos.x,
      pos.y + 0.5,
      pos.z,
      0,
      0.01,
      0,
      Player.getLocal() //!
    )
  );
};

Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
  if (block.id == EForestPlants.ELECTRIC_MUSHROOM) {
    return electric_damage(Player.get());
  }
});

Block.setAnimateTickCallback(
  EForestPlants.FIRONIA,
  function (x, y, z, id, data) {
    Particles.addParticle(
      Native.ParticleType.flame,
      x + 0.5,
      y + 0.7,
      z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20
    );
  }
);

Block.registerClickFunctionForID(
  EForestPlants.FIRONIA,
  (coords, item, block, player) => {
    if (Game.getGameMode() === EGameMode.CREATIVE) return;
    Entity.setFire(player, 3, false);
  }
);

class Mushroom extends TileEntityBase {
  public static particle(that, y = 0.4) {
    ForestParticle.send(
      EForestParticle.ELECTRIC,
      that.x + 0.5,
      that.y + y,
      that.z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20,
      Player.getLocal() //!
    );
  }
  public electicityChain(x, z) {}
  onTick(): void {
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
};

TileEntity.registerPrototype(EForestPlants.ELECTRIC_MUSHROOM, new Mushroom());

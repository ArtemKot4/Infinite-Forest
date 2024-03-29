namespace Plants {
  export function registry(
    id: string,
    texture: string,
    type = BLOCK_TYPE_PLANT
  ) {
    new FBlock(id, [
      {
        name: id,
        texture: [[texture, 0]],
        inCreative: true,
        data: type,
      },
    ]);
    const render = new ICRender.Model();
    const model = BlockRenderer.createModel();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();
    entry.addBox(0, 0, 0, 0, 0, 0);
    BlockRenderer.setCustomCollisionShape(BlockID[id], -1, shape);
    render.addEntry(model);

    Block.registerPlaceFunctionForID(
      ItemID[id],
      (coords, item, block, player) => {
        const blockSource = BlockSource.getDefaultForActor(player);
        if (
          blockSource.getBlockId(coords.x, coords.y - 1, coords.z) !==
          VanillaBlockID.grass
        ) {
          blockSource.destroyBlock(coords.x, coords.y, coords.z);
        }
      }
    );
  }
}

Plants.registry("electric_mushroom", "electric_mushroom", BLOCK_TYPE_ELECTRIC);

Plants.registry("fironia", "fironia", BLOCK_TYPE_FIRE);

enum EPlants {
  ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
  FIRONIA = BlockID["fironia"],
}

Block.setTempDestroyTime(EPlants.ELECTRIC_MUSHROOM, 20 * 60);

const electric_damage = (player) => {
  if (Game.getGameMode() === EGameMode.CREATIVE) return;
  const pos = Entity.getPosition(player)
  return (
    Entity.damageEntity(player, 5),
    Game.tipMessage(Native.Color.BLUE + Translation.translate("Electric pain!")),
    spawnParticle(EParticles.ELECTRIC, pos.x, pos.y + 0.5, pos.z, 0, 0.01, 0)
  );
};



Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
  if (block.id == EPlants.ELECTRIC_MUSHROOM) {
    return electric_damage(Player.get());
  }
});


Block.setAnimateTickCallback(EPlants.FIRONIA, function (x, y, z, id, data) {
  Particles.addParticle(
    Native.ParticleType.flame,
    x + 0.5,
    y + 0.7,
    z + 0.5,
    Math.random() / 20,
    Math.random() / 20,
    Math.random() / 20
  );
});

Block.registerClickFunctionForID(
  EPlants.FIRONIA,
  (coords, item, block, player) => {
    if (Game.getGameMode() == EGameMode.CREATIVE) return;
    Entity.setFire(player, 3, false);
  }
);

class Mushroom extends TileEntityBase {
  public static particle(that, y = 0.4) {
    spawnParticle(
      EParticles.ELECTRIC,
      that.x + 0.5,
      that.y + y,
      that.z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20
    );
  };
  public electicityChain(x, z) {
    const get = (x: int, z: int) => this.blockSource.getBlockId(x, this.y, z) === EPlants.ELECTRIC_MUSHROOM;
     for(let i; i < 10; i++) {
      // if(get) {
      //   Particles.addParticle(EParticles.ELECTRIC, x, this.y + 0.4, z);
      // }
     }
  }
  onTick(): void {
    if(World.getThreadTime() % 10 === 0){
   Mushroom.particle(this);
   Mushroom.particle(this);
   Mushroom.particle(this);
    };
  };
  onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
    return electric_damage(player);
  };
}
TileEntity.registerPrototype(EPlants.ELECTRIC_MUSHROOM, new Mushroom());

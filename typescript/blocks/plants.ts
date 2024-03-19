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
  }
}

Plants.registry("electric_mushroom", "electric_mushroom", BLOCK_TYPE_ELECTRIC);

Plants.registry("fironia", "fironia", BLOCK_TYPE_FIRE);

enum EPlants {
  ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
  FIRONIA = BlockID["fironia"]
}

Block.setTempDestroyTime(EPlants.ELECTRIC_MUSHROOM, 20 * 60);

const electric_damage = (player) => {
  if (Game.getGameMode() === EGameMode.CREATIVE) return;
  return (
    Entity.damageEntity(player, 5),
    Game.tipMessage(Native.Color.BLUE + Translation.translate("Electric pain!"))
  );
};

Block.registerClickFunctionForID(
  EPlants.ELECTRIC_MUSHROOM,
  (coords, item, block, player) => {
    return electric_damage(player);
  }
);

Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
  if (block.id == EPlants.ELECTRIC_MUSHROOM) {
    return electric_damage(Player.get());
  }
});



Block.setAnimateTickCallback(EPlants.FIRONIA, function(x, y, z, id, data) {
 Particles.addParticle(Native.ParticleType.flame,x+0.5,y+0.7,z+0.5,Math.random()/20,Math.random()/20,Math.random()/20)
});

Block.registerClickFunctionForID(EPlants.FIRONIA, (coords, item, block, player) => {

   const animation = new Animation.Base(coords.x, coords.y + 0.3, coords.z);
   animation.describe({mesh: Cauldron.WATERMESH});
   animation.load(); 

    if(Game.getGameMode() == EGameMode.CREATIVE) return;
    Entity.setFire(player, 3, false);
})
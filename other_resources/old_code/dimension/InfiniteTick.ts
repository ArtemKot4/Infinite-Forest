Callback.addCallback("LocalTick", () => {
  if (Player.getDimension() !== InfiniteForest.id) {
    return;
  };

  const pos = Player.getPosition();
  const biome = World.getBiome(pos.x, pos.z);
  const player = Player.getLocal();

  if (biome === ForestBiomes.FirefliesForest.id) {
    if (World.getThreadTime() % 15 === 0) {
      addFire(pos);
    };

    addGlowworm(pos, EForestParticle.GLOWWORM_1);
    addGlowworm(pos, EForestParticle.GLOWWORM_2);
    addGlowworm(pos, EForestParticle.GLOWWORM_4);
  };

  if (biome === ForestBiomes.WinterForest.id) {
    ColdCurse.runSnow(pos.x, pos.y + 12.5, pos.z, 16, 16); //32 24
    ColdCurse.allowHas(player) && Entity.damageEntity(player, 1);
  };

  if (World.getThreadTime() % 30 === 0) {
    ColdCurse.sendMessage(pos);
   
  };

  ColdCurse.subscribe(() => {
    if (pos.y >= 100) {

      if (pos.y <= 130) {
  
        ColdCurse.runSnow(pos.x, 130, pos.z, 512);
      } else {
        
        ColdCurse.runSnow(pos.x, pos.y + 12.5, pos.z, 64, 24);
        Entity.damageEntity(player, 2);
        
      }
      return;
    }
  });
  if(World.getThreadTime() % 200 === 0) {
    ColdCurse.subscribe(() => Game.message("Я работаю, проклятие есть!)"))
  }
  return;
})
   


Callback.addCallback("PlayerChangedDimension", function (player, from, to) {
  if (Entity.getDimension(player) === InfiniteForest.id) {
    // Learning.send(
    //   "infinite_forest_is_real",
    //   player,
    //   Native.Color.BLUE,
    //   "forest_title",
    //   ["crystal", "snow", "fire", "forest"]
    // );
    
  }
});

// if (biome === ForestBiomes.VolcanicLands.getID()) {
//   ForestBiomes.addS(
//     EForestParticle.VANILLA_RAIN,
//     16,
//     24,
//     pos.x,
//     pos.y + 12.5,
//     pos.z,
//     MathHelper.randomValue(-0.08, 0.08),
//     0,
//     MathHelper.randomValue(-0.06, 0.06)
//   );
// }

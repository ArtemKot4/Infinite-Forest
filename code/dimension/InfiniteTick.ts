const InfiniteTick = () => {
  return {
    update(): void {
      const pos = Player.getPosition();
      const biome = World.getBiome(pos.x, pos.z);
      const player = Player.getLocal();
      if (Player.getDimension() !== InfiniteForest.id) {
        this.remove = true;
      }
      if (biome === ForestBiomes.FirefliesForest.getID()) {
        addFire(pos);
        for (let i = 0; i < 3; i++) {
          addGlowworm(pos);
        }
      }
      if (biome === ForestBiomes.WinterForest.getID()) {
        ColdCurse.runSnow(pos.x, pos.y + 12.5, pos.z, 32, 24);
        Entity.damageEntity(player, 4);
      }

      if (World.getThreadTime() % 20 === 0) {
        ColdCurse.onTick(this.ticker, player);
        ColdCurse.sendMessage(pos);
      }
      if (pos.y >= 100) {
        if (pos.y <= 130) {
          ColdCurse.runSnow(pos.x, 130, pos.z, 512);
        } else {
          ColdCurse.runSnow(pos.x, pos.y + 12.5, pos.z, 64, 24);
        }
        return;
      }
    },
  };
};

Callback.addCallback("PlayerChangedDimension", function (player, from, to) {
  if (Entity.getDimension(player) === InfiniteForest.id) {
    Learning.send(
      "infinite_forest_is_real",
      player,
      Native.Color.BLUE,
      "forest_title"
    );
    Updatable.addLocalUpdatable(InfiniteTick());
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
Callback.addCallback("LocalTick", () => {
    let pos = Player.getPosition();
    if (World.getThreadTime()%200&&Player.getDimension() == InfiniteForest.id) {
      addGlowworm(pos);
      for (var i = 0; i < 3; i++) {
        addFire(pos);
      }
    }
   
  });
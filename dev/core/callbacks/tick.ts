Callback.addCallback("LocalTick", () => {
  FItem.onTick();
  let pos = Player.getPosition();
  if (Player.getDimension() == InfiniteForest.id) {
    addGlowworm(pos);
    for (var i = 0; i < 3; i++) {
      addFire(pos);
    }
  }

  if (
    World.getThreadTime() % 8 == 0 && Player.getDimension() != InfiniteForest.id
  ) {
   for(var c;c<7;c++){
    spawnStars(pos);
   }
  }
});

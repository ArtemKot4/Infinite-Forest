const InfiniteTick = () => {
  return {
    update(): void {
      let pos = Player.getPosition();
      if (Player.getDimension() !== InfiniteForest.id) {
        this.remove = true;
      }
      addGlowworm(pos);
      for (let i = 0; i < 3; i++) {
        addFire(pos);
      }
    },
  };
};

Callback.addCallback("PlayerChangedDimension", function (player, from, to) {
  if (Entity.getDimension(player) === InfiniteForest.id) {
    Updatable.addLocalUpdatable(InfiniteTick());
  }
});

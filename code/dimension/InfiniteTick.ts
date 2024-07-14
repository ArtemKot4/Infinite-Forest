const InfiniteTick = () => {
  return {
    ticker: 3000,
    update(): void {
      let pos = Player.getPosition();
      const player = Player.getLocal();
      if (Player.getDimension() !== InfiniteForest.id) {
        this.remove = true;
      }
      addFire(pos);
      for (let i = 0; i < 3; i++) {
        addGlowworm(pos);
      };
      if (World.getThreadTime() % 20 === 0) {
        Curses.COLD.onTick(this.ticker, player);
        ColdCurse.sendMessage(pos);
      };
      if (pos.y >= 100) {
        if (pos.y <= 130) {
          this.ticker = 3000;
          ColdCurse.runSnow(pos.x, 130, pos.z);
        } else {
          ColdCurse.runSnow(pos.x, pos.y + 10, pos.z, 128);
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

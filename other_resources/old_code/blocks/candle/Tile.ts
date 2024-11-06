class CandleTileReplacer {
  public static coordsList = new Map<string, int>();
  public static initialize(x: int, y: int, z: int) {
    if (this.coordsList.has(`${x} ${y} ${z}`)) {
      return;
    }

    CandleTileReplacer.coordsList.set(`${x} ${y} ${z}`, 1);

    Updatable.addLocalUpdatable({
      x,
      y,
      z,
      update() {
        const region = BlockSource.getCurrentClientRegion();
        const block = region.getBlock(this.x, this.y, this.z);
        const biome = region.getBiome(this.x, this.z);

        if (World.getThreadTime() % 60 === 0) {
          if (!ForestUtils.hasWordInID(block.id, "candle")) {
            CandleTileReplacer.coordsList?.delete(`${x} ${y} ${z}`);
            this.remove = true;
          }
        }

        if (World.getThreadTime() % 200 === 0) {
          if (
            (region.canSeeSky(this.x, this.y + 1, this.z) &&
              World.getWeather().rain > 0) ||
            region.getBlockId(this.x, this.y + 1, this.z) !== 0 ||
            (ColdCurse.worldIs() && biome === ForestBiomes.WinterForest.id) ||
            this.y >= 130
          ) {
            CandleTileReplacer.clear(this.x, this.y, this.z, block);
            this.remove = true;
          }
        }

        if (World.getThreadTime() % 5 === 0) {
          const clicks =
            CandleTileReplacer.coordsList.get(`${x} ${y} ${z}`) || 1;

          clicks >= 1 &&
            block.data >= 0 &&
            Particles.addParticle(
              EParticleType.FLAME,
              this.x + 0.5,
              this.y + 0.75,
              this.z + 0.5,
              0,
              0.005,
              0
            );

          clicks >= 2 &&
            block.data >= 1 &&
            Particles.addParticle(
              EParticleType.FLAME,
              this.x + 0.8,
              this.y + 0.6,
              this.z + 0.5,
              0,
              0.005,
              0
            );

          clicks >= 3 &&
            block.data >= 2 &&
            Particles.addParticle(
              EParticleType.FLAME,
              this.x + 0.2,
              this.y + 0.6,
              this.z + 0.5,
              0,
              0.005,
              0
            );

          clicks >= 4 &&
            block.data >= 3 &&
            Particles.addParticle(
              EParticleType.FLAME,
              this.x + 0.5,
              this.y + 0.6,
              this.z + 0.8,
              0,
              0.005,
              0
            );

          clicks >= 5 &&
            block.data >= 4 &&
            Particles.addParticle(
              EParticleType.FLAME,
              this.x + 0.5,
              this.y + 0.6,
              this.z + 0.2,
              0,
              0.005,
              0
            );
        }
      },
    });
  }

  public static isCandleFlamed(x: int, y: int, z: int) {
    return CandleTileReplacer.coordsList.has(`${x} ${y} ${z}`);
  }

  public static clear(x: int, y: int, z: int, block: Tile) {
    BlockSource.getDefaultForActor(Player.getLocal()).setBlock(
      x,
      y,
      z,
      BlockID["candle_unlit"],
      block.data
    );
    CandleTileReplacer.coordsList?.delete(`${x} ${y} ${z}`);
  }

  @onLevelDisplayed
  public static initCandles() {
    const keys = CandleTileReplacer.coordsList.keys();
    for (const key of keys) {
      const xyz = key.split(" ").map((v) => Number(v));
      const [x, y, z] = xyz;
      CandleTileReplacer.initialize(x, y, z);
    }
    return;
  }

  static {
    Saver.addSavesScope(
      "scope.infinite_forest.candle_tile_replacer",
      function read(scope) {
        CandleTileReplacer.coordsList =
          scope?.coordsList || new Map<string, int>();
      },
      function save() {
        return { coordsList: CandleTileReplacer.coordsList };
      }
    );
  }
};



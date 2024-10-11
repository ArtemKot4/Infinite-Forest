
class CandleTileReplacer {
  public static coordsList = new Map<Vector, int>();
  public static initialize(x: int, y: int, z: int) {
    if (this.coordsList.has({ x, y, z })) {
      return;
    }

    CandleTileReplacer.coordsList.set({ x, y, z }, 1);

    Updatable.addLocalUpdatable({
      x,
      y,
      z,
      update() {
        const region = BlockSource.getCurrentClientRegion();
        const block = region.getBlock(this.x, this.y, this.z);
        const biome = region.getBiome(this.x, this.z);

        if (World.getThreadTime() % 60 === 0) {
          if (!hasWordInID(block.id, "candle")) {
            this.coordsList.delete({ x, y, z });
            this.remove = true;
          }
        }

        if (World.getThreadTime() % 200 === 0) {
          Game.message(
            "click count in candleTile: ->" +
              CandleTileReplacer.coordsList.get({
                x,
                y,
                z,
              })
          );
          if (
            (region.canSeeSky(this.x, this.y + 1, this.z) &&
              World.getWeather().rain > 0) ||
            region.getBlockId(this.x, this.y + 1, this.z) !== 0 ||
            biome === ForestBiomes.WinterForest.id ||
            this.y >= 130
          ) {
            CandleTileReplacer.clear(this.x, this.y, this.z, block);
            this.remove = true;
          }
        }

        if (World.getThreadTime() % 5 === 0) {
          const clicks =
            CandleTileReplacer.coordsList.get({
              x: this.x,
              y: this.y,
              z: this.z,
            }) || 1;

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
    return CandleTileReplacer.coordsList.has({ x, y, z });
  }

  public static clear(x: int, y: int, z: int, block: Tile) {
    BlockSource.getDefaultForActor(Player.getLocal()).setBlock(
      x,
      y,
      z,
      BlockID["candle_unlit"],
      block.data
    );
    this.coordsList.delete({ x, y, z });
  }
}

class Candle extends FBlock {
  public static readonly CANDLE_MAX = 5;
  public static readonly CANDLE_MAX_DATA = 4;
  
  public static meshes = (() => {
    const one = new RenderMesh();
    one.importFromFile(MODELSDIR + "block/candle_max.obj", "obj", {
      translate: [0.5, 0.5, 0.5],
      invertV: false,
      noRebuild: false,
    });

    one.setBlockTexture("candle", 0);

    const small = new RenderMesh();
    small.importFromFile(MODELSDIR + "block/candle_min.obj", "obj", {
      translate: [0.5, 0.5, 0.5],
      invertV: false,
      noRebuild: false,
    });

    small.setBlockTexture("candle", 0);

    const two = one.clone();
    two.addMesh(small, 0.3, 0, 0);

    const three = two.clone();
    three.addMesh(small, -0.3, 0, 0);

    const four = three.clone();
    four.addMesh(small, 0, 0, 0.3);
    four.setBlockTexture("candle", 0);

    const five = four.clone();
    five.addMesh(small, 0, 0, -0.3);

    return [one, two, three, four, five];
  })();

  public static shape = (() => {
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();
    entry.addBox(0, 0, 0, 0.59375, 0.5643750000000001, 0.59375);
    return shape;
  })();

  constructor(public id: string, lightLevel: int) {
    super(
      id,
      [
        {
          inCreative: false,
          name: "block.infinite_forest.candle",
          texture: [["salt", 0]],
        },
      ],
      { lightlevel: lightLevel }
    );

    Block.registerClickFunction(id, (coords, item, block, player) => {
      const region = BlockSource.getDefaultForActor(player);

      if (
        item.id === BlockID["candle_unlit"] &&
        block.data < Candle.CANDLE_MAX_DATA
      ) {
        region.setBlock(coords.x, coords.y, coords.z, block.id, block.data + 1);

        return;
      }

      if (item.id === VanillaItemID.flint_and_steel) {
        const stringId = String(IDRegistry.getIdInfo(block.id)).split(":")[1];
        const endChar = Number(stringId[stringId.length - 1]);

        const clicks = CandleTileReplacer.coordsList.get({
          x: coords.x,
          y: coords.y,
          z: coords.z,
        });

        if (endChar >= Candle.CANDLE_MAX_DATA) {
          return;
        }

        let newID = "candle_lit_1";

        if (block.id !== BlockID["candle_unlit"]) {
          if (typeof endChar === "number" && endChar < Candle.CANDLE_MAX_DATA) {
            newID = "candle_lit_" + (endChar + 1);
          }
        }

        Entity.setCarriedItem(
          player,
          item.id,
          item.count,
          item.data++,
          item.extra
        );

        region.setBlock(
          coords.x,
          coords.y,
          coords.z,
          BlockID[newID],
          block.data
        );

        CandleTileReplacer.initialize(coords.x, coords.y, coords.z);

        Game.message("clicks: -> " + clicks);

        CandleTileReplacer.coordsList.set(
          { x: coords.x, y: coords.y, z: coords.z },
          clicks + 1 || 1
        );

        return;
      }
    });

    Candle.meshes.forEach((v, i) => this.setupBlockModelFromMesh(v, i));
    BlockRenderer.setCustomCollisionShape(BlockID[id], -1, Candle.shape);
  }

  public static getCount(region: BlockSource | WorldRegion, coords: Vector) {
    const block = region.getBlock(coords.x, coords.y, coords.z);

    return hasWordInID(block.id, "candle") ? block.data + 1 : 1;
  }
}

namespace ELightCandles {
  export const none = new Candle("candle_unlit", 0).create();
  export const three = new Candle("candle_lit_1", 3).create();
  export const six = new Candle("candle_lit_2", 6).create();
  export const nine = new Candle("candle_lit_3", 9).create();
  export const twenty = new Candle("candle_lit_4", 12).create();
}

Translation.addTranslation("block.infinite_forest.candle", {
  en: "Candle",
  ru: "Свеча",
});


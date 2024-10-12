

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

        const clicks = CandleTileReplacer.coordsList.get(`${coords.x} ${coords.y} ${coords.z}`);

        if (endChar >= Candle.CANDLE_MAX_DATA) {
          return;
        }

        let newID = "candle_lit_1";

        if (block.id !== BlockID["candle_unlit"]) {
          if (typeof endChar === "number" && endChar < Candle.CANDLE_MAX_DATA && endChar === clicks) {
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

        CandleTileReplacer.coordsList.set(
          `${coords.x} ${coords.y} ${coords.z}`,
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


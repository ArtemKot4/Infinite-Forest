class Candle extends FBlock {
  public static readonly CANDLE_MAX = 5;

  public settingModels = (() => {
    const one = new RenderMesh(MODELSDIR + "block/candle_max.obj", "obj", {
      translate: [0.5, 0, 0.5],
      invertV: false,
      noRebuild: false,
    });

    one.setBlockTexture("candle", 0);
    this.setupBlockModelFromMesh(one, 0);

    const small = new RenderMesh(MODELSDIR + "block/candle_min.obj", "obj", {
      translate: [0.5, 0, 0.5],
      invertV: false,
      noRebuild: false,
    });

    const two = one.clone();
    two.addMesh(small, 0.3, 0, 0);
    two.setBlockTexture("candle", 0);
    this.setupBlockModelFromMesh(two, 1);

    const three = two.clone();
    three.addMesh(small, -0.3, 0, 0);
    three.setBlockTexture("candle", 0);
    this.setupBlockModelFromMesh(three, 2);

    const four = three.clone();
    four.addMesh(small, 0, 0, 0.3);
    four.setBlockTexture("candle", 0);
    this.setupBlockModelFromMesh(four, 3);

    const five = four.clone();
    five.addMesh(small, 0, 0, -0.3);
    five.setBlockTexture("candle", 0);
    this.setupBlockModelFromMesh(five, 4);

    Block.registerClickFunction("candle", (coords, item, block, player) => {
      if (item.id === block.id && block.data < Candle.CANDLE_MAX) {
        BlockSource.getDefaultForActor(player).setBlock(
          coords.x,
          coords.y,
          coords.z,
          block.id,
          block.data + 1
        );
      }
    });
  })();

  constructor() {
    super(
      "candle",
      [
        {
          inCreative: true,
          name: "block.infinite_forest.candle",
          texture: [["salt", 0]],
        },
      ],
      "stone"
    );
  };

  public static getCount(region: BlockSource, coords: Vector) {
    const block = region.getBlock(coords.x, coords.y, coords.z);
    return Number(block.id === BlockID["candle"] ? block.data : 0);
  }
}

new Candle().create();

Translation.addTranslation("block.infinite_forest.candle", {
  en: "Candle",
  ru: "Свеча",
});

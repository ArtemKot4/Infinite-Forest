type chance = 10 | 50 | 40 | 25 | 65;
type number3 = [number, number, number];
class ArchaeologyBlock {
  public static readonly percents = [10, 25, 40, 50, 65] satisfies chance[];
  protected static readonly ANIMATION_CREATE_VALID_DATA = 3;
  protected readonly dropList: Record<chance, ItemInstance[]> = {
    10: [],
    50: [],
    40: [],
    25: [],
    65: [],
  };
  protected itemStorage: Map<
    Vector,
    { item: ItemInstance; animation: Animation.Item }
  > = new Map();
  constructor(public id: int) {
    Block.registerClickFunctionForID(id, this.clickLogic.bind(this));
    this.setModelByData(1, 14);
    this.setModelByData(2, 11);
    this.setModelByData(3, 7);
    this.setModelByData(4, 4);
    this.setModelByData(5, 2);
  }
  public setModelByData(data: int, height: int) {
    const model = BlockRenderer.createModel();
    const render = new ICRender.Model();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();

    model.addBox(0, 0, 0, 1, height / 16, 1, this.id, 0);
    entry.addBox(0, 0, 0, 1, height / 16, 1);
    render.addEntry(model);
    return (
      BlockRenderer.setCustomCollisionShape(this.id, data, shape),
      BlockRenderer.setStaticICRender(this.id, data, render)
    );
  }
  public registerDrop(stack: ItemStack | int, chance: chance = 50) {
    this.dropList[chance].push(
      stack instanceof ItemStack ? stack : new ItemStack(stack, 1, 0, null)
    );
  }
  protected itemExists(coords: Callback.ItemUseCoordinates) {
    return this.itemStorage.has(coords) === true;
  }
  protected getItemFromChance(chance: chance) {
    if (Math.random() < chance) {
      return MathHelper.randomValueFromArray(this.dropList[chance]);
    }
    return null;
  }
  protected selectItem(): ItemInstance {
    const items = ArchaeologyBlock.percents.map((v) =>
      this.getItemFromChance(v)
    );
    const filtered = items.filter((v) => v !== null);
    const randomResult = MathHelper.randomValueFromArray(filtered);
    return MathHelper.randomValue<ItemInstance>(
      randomResult ?? new ItemStack()
    );
  }
  protected createAnimation(block: Tile, coords: Callback.ItemUseCoordinates) {
    const pack = this.itemStorage.get(coords);
    if(!pack) return;
    if (
      pack.animation !== null ||
      block.data !== ArchaeologyBlock.ANIMATION_CREATE_VALID_DATA
    ) {
      return;
    }
    pack.animation = new Animation.Item(
      coords.x + 0.5,
      coords.y + 0.25,
      coords.z
    );
    pack.animation.describeItem(
      Object.assign({}, pack.item, {
        size: 0.4,
        rotation: [Math.PI / 2, 0, 0] as number3,
      })
    );
    pack.animation.load();
  }
  protected addItemByCoordinates(
    block: Tile,
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance
  ) {
    Game.message(JSON.stringify(block));
      this.itemStorage.set(coords, { item: item, animation: null });
  }
  protected takeItem(
    block: Tile,
    coords: Callback.ItemUseCoordinates,
    player: int
  ) {
    if (block.data >= 4 && this.itemExists(coords)) {
      const entity = new PlayerEntity(player);
      const pack = this.itemStorage.get(coords);
      if (entity.getCarriedItem().isEmpty()) {
        entity.setCarriedItem(pack.item);
      } else {
        entity.addItemToInventory(pack.item);
      }
      this.itemStorage.delete(coords);
    }
  }
  protected manipulateData(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    player: int
  ) {
    const region = BlockSource.getDefaultForActor(player);
    if (block.data < 5) {
      region.setBlock(coords.x, coords.y, coords.z, block.id, block.data++);
    }
    if (block.data === 5) {
      region.destroyBlock(coords.x, coords.y, coords.z, false);
    }
    return;
  }
  protected clickLogic(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number
  ) {
    if (!this.itemExists(coords)) {
      const instance = this.selectItem();
      this.addItemByCoordinates(block, coords, instance);
    }
    this.createAnimation(block, coords);
    this.takeItem(block, coords, player);
    this.manipulateData(coords, block, player);
    return;
  }
}

namespace ArchaeologyBlocks {
  export const SAND = new ArchaeologyBlock(VanillaBlockID.sand);
  SAND.registerDrop(new ItemStack(VanillaItemID.diamond, 1, 0), 65);
  SAND.registerDrop(new ItemStack(VanillaItemID.gunpowder, 1, 0), 25);
}

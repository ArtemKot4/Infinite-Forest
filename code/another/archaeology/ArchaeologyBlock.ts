type chance = 10 | 50 | 40 | 25 | 65;
type number3 = [number, number, number];
class ArchaeologyBlock extends FBlock {
  public static readonly percents = [10, 25, 40, 50, 65] satisfies chance[];
  protected static readonly ANIMATION_CREATE_VALID_DATA = 3;
  protected readonly dropList: Record<chance, ItemInstance[]> = {
    10: [],
    50: [],
    40: [],
    25: [],
    65: []
  };
  constructor(public id: string, public texture: string, sound: Block.Sound) {
    super(id, [
      {
        name: `block.infinite_forest.${id}`,
        texture: [
          [texture, 0],
          [texture, 0],
          [texture, 0],
          [texture, 0],
          [texture, 0],
          [texture, 0],
        ],
        inCreative: true,
      },
    ]);
    this.createWithRotation();
    BlockRegistry.setSoundType(id, sound);
    Block.registerClickFunctionForID(this.getID(), this.clickLogic.bind(this));
    Block.registerPlaceFunctionForID(
      this.getID(),
      this.place.bind({ id: BlockID[id] })
    );
    this.setModelByData(1, 14);
    this.setModelByData(2, 11);
    this.setModelByData(3, 7);
    this.setModelByData(4, 4);
    this.setModelByData(5, 2);
  }
  public place(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number,
    region: BlockSource
  ) {
    const rel = coords.relative;
    return region.setBlock(rel.x, rel.y, rel.z, this.id as unknown as int, 0);
  }
  public setModelByData(data: int, height: int) {
    const model = BlockRenderer.createModel();
    const render = new ICRender.Model();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();

    model.addBox(0, 0, 0, 1, height / 16, 1, this.texture, 0);
    entry.addBox(0, 0, 0, 1, height / 16, 1);
    render.addEntry(model);
    return (
      BlockRenderer.setCustomCollisionShape(this.getID(), data, shape),
      BlockRenderer.setStaticICRender(this.getID(), data, render)
    );
  }
  public registerDrop(
    instance: ItemInstance,
    chance: chance = 50
  ) {
    this.dropList[chance].push(
      instance
    );
  }
  protected getItemFromChance(chance: chance): Nullable<ItemInstance> {
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
 
  protected manipulateData(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    player: int
  ): void {
    const region = BlockSource.getDefaultForActor(player);
    if (block.data < 5) {
      return region.setBlock(
        coords.x,
        coords.y,
        coords.z,
        this.getID(),
        (block.data += 1)
      );
    }
    if (block.data === 5) {
      return region.destroyBlock(coords.x, coords.y, coords.z, false);
    }
  }
  protected clickLogic(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number
  ): void {
    if (Entity.getDimension(player) !== InfiniteForest.id) {
      return;
    }
    if (
      World.getWeather().rain === 0 &&
      new PlayerActor(player).getGameMode() !== EGameMode.CREATIVE
    ) {
      BlockEngine.sendUnlocalizedMessage(
        Network.getClientForPlayer(player),
        Native.Color.GREEN,
        Translation.translate(
          "message.infinite_forest.archaeology_water_not_valid"
        )
      );
      return;
    }

    this.manipulateData(coords, block, player);
    if (block.data === 5) {
      let item: ItemInstance;
      if(Entity.getPosition(player).y <= 130) {
       item = this.selectItem();
      } else {

      }
      Game.message(JSON.stringify(item));
      new PlayerEntity(player).addItemToInventory(item);
    }
    return;
  }
}

namespace ArchaeologyBlocks {
  export const SAND = new ArchaeologyBlock("archaeology_sand", "sand", "sand");
  SAND.registerDrop(new ItemStack(VanillaItemID.diamond, 1, 0), 65);
  SAND.registerDrop(new ItemStack(VanillaItemID.gunpowder, 1, 0), 25);
}

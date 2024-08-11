namespace Plants {
  Plants.registry(
    "electric_mushroom",
    "electric_mushroom",
    BLOCK_TYPE_ELECTRIC
  );

  breakHasAir(EForestPlants.ELECTRIC_MUSHROOM);
  setPlaceFunction(EForestPlants.ELECTRIC_MUSHROOM, [
    VanillaBlockID.grass,
    VanillaBlockID.stone,
    VanillaBlockID.mycelium,
  ]);

  Block.setTempDestroyTime(EForestPlants.ELECTRIC_MUSHROOM, 20 * 60);

  export class Mushroom extends TileEntityBase {
    public static particle(that, y = 0.4) {
      Particles.addParticle(
        EForestParticle.ELECTRIC,
        that.x + 0.5,
        that.y + y,
        that.z + 0.5,
        Math.random() / 20,
        Math.random() / 20,
        Math.random() / 20
      );
    }
    clientTick(): void {
      if (World.getThreadTime() % 10 === 0) {
        Mushroom.particle(this);
        Mushroom.particle(this);
        Mushroom.particle(this);
      }
    }
    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ) {
      return Entity.damageEntity(player, 1);
    }
  }

  TileEntity.registerPrototype(EForestPlants.ELECTRIC_MUSHROOM, new Mushroom());

  Block.setRandomTickCallback(
    EForestPlants.ELECTRIC_MUSHROOM,
    (x, y, z, id, data, region) => {
      if (TileEntity.getTileEntity(x, y, z, region) !== null) {
        return;
      }
      TileEntity.destroyTileEntityAtCoords(x, y, z, region);
      TileEntity.addTileEntity(x, y, z, region);
      return;
    }
  );

  Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
    if (block.id == EForestPlants.ELECTRIC_MUSHROOM) {
      return ServerPlayerDamage();
    }
  });

  export const MushroomBlock: FBlock = new FBlock("blue_mushroom_block", [
    {
      name: "block.infinite_forest.blue_mushroom_block",
      texture: [["mushroom_block_skin_blue", 0]],
      inCreative: true,
    },
  ]).create();

  Block.setAnimateTickCallback(MushroomBlock.getID(), (x, y, z, id, data) => {
    Mushroom.particle({ x, z }, 1.5);
    Mushroom.particle({ x, z }, -1.5);
    return;
  });

  BlockRegistry.setSoundType(MushroomBlock.getID(), "cloth");
  Block.registerDropFunctionForID(
    MushroomBlock.getID(),
    (coords, id, data, diggingLevel, enchant, item, region) => {
      if (
        ToolAPI.getToolData(item.id)?.blockMaterials?.["wood"] &&
        Math.random() < 0.25
      ) {
        return [[EForestPlants.ELECTRIC_MUSHROOM, 1, 0]];
      }
      return [[0, 0, 0]];
    }
  );

}

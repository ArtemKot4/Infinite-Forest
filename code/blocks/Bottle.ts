

const EMPTY_BOTTLE = new FBlock("bottle", [
  {
    name: "block.infinite_forest.bottle",
    texture: [["glass", 0]],
    inCreative: true,
  },
])
  .create().setDestroyTime(0.5)
  .setupBlockModel(
    {
      model: "block/bottle",
      texture: "forest_bottle",
    },
    0
  );

const FULL_BOTTLE = new FBlock("fireflies_bottle", [
  {
    name: "block.infinite_forest.fireflies_bottle",
    texture: [["glass", 0]],
    inCreative: true,
  },
])
  .create().setDestroyTime(0.5)
  .setupBlockModel(
    {
      model: "block/bottle",
      texture: "forest_bottle",
    },
    0
  );

class FirefliesBottle extends TileEntityBase {
  data: { color: int };
  public static destroyParticles(
    x: int,
    y: int,
    z: int,
    player: int,
    color: int
  ) {
    return ParticlePacket.send(
      color,
      x + 0.5,
      y + 0.4,
      z + 0.5,
      0,
      0.01,
      0,
      player
    );
  }
  public clientTick(): void {
    const color = this.networkData.getInt("color", EForestParticle.GLOWWORM_1);
    if (World.getThreadTime() % 20 === 0) {
      Particles.addParticle(
        color,
        this.x + 0.5,
        this.y + 0.4,
        this.z + 0.5,
        0.001,
        0.001,
        0.001
      );
    }
  }
  public static setGlowwormColor(
    coords: Vector,
    region: BlockSource,
    color: int
  ) {
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region);
    if (tile && tile.data && tile.networkData) {
      tile.data.color = color;
      tile.networkData.putInt("color", color);
    }
  }
  static {
    BlockRegistry.setSoundType(BlockID["bottle"], "glass");
    BlockRegistry.setSoundType(BlockID["fireflies_bottle"], "glass");
    BlockRegistry.setLightLevel(BlockID["fireflies_bottle"], 10);
    Projectiles.breakBlock(BlockID["bottle"]);
    Projectiles.breakBlock(
      BlockID["fireflies_bottle"],
      (x, y, z, block, region) =>
        FirefliesBottle.destroyParticles(
          x,
          y,
          z,
          Player.getLocal(),
          TileEntity.getTileEntity(x, y, z)?.data?.color ||
            EForestParticle.GLOWWORM_1
        ) //!
    );
    TileEntity.registerPrototype(
      BlockID["fireflies_bottle"],
      new FirefliesBottle()
    );
  }
}

function iceStateDestroy(
  biomeState: EForestState,
  x: int,
  y: int,
  z: int,
  region: BlockSource
) {
  if (y >= 130 || biomeState === EForestState.ICE) {
    region.destroyBlock(x, y, z, false);
    return true;
  }
  return false;
}

function placeFirefliesBottle(
  x: int,
  y: int,
  z: int,
  region: BlockSource,
  glowwormColor: int
) {
  region.destroyBlock(x, y, z, false);
  TileEntity.destroyTileEntityAtCoords(x, y, z);
  region.setBlock(x, y, z, BlockID["fireflies_bottle"], 0);

  TileEntity.addTileEntity(x, y, z, region);
  FirefliesBottle.setGlowwormColor({ x, y, z }, region, glowwormColor);
  return;
}

function destroyBottleByRandom(x: int, y: int, z: int, region: BlockSource) {
  if (Math.random() < 0.5) {

      region.destroyBlock(x, y, z, false), region.explode(x, y, z, 0.1, false);
      if (Plants.block_list.includes(region.getBlockId(x, y - 1, z))) {
        region.setBlock(x, y - 1, z, VanillaBlockID.podzol, 0);
    }
    return true;
  }
  return false;
}

Block.setRandomTickCallback(BlockID["bottle"], (x, y, z, id, data, region) => {
  const biomeState = ForestBiomes.ForestBiome.getState(World.getBiome(x, z));
  const isCurseDestroyed = iceStateDestroy(biomeState, x, y, z, region);
  if (isCurseDestroyed) {
    return;
  }
  if (
    Block.getLightLevel(region.getBlockId(x, y + 1, z)) <= 5 ||
    region.getDimension() !== InfiniteForest.id ||
    biomeState !== EForestState.BALANCE
  ) {
    return;
  }
  const glowwormColor = randomGlowworm();
  CursedLightning.speedGlowworm(x, y, z, region, glowwormColor);
  region.destroyBlock(x, y + 1, z, false);
  const isDestroyed = destroyBottleByRandom(x, y, z, region);
  if (isDestroyed) {
    return;
  }
  return placeFirefliesBottle(x, y, z, region, glowwormColor);
});

function destroyBottle(
  coords: Vector,
  block: Tile,
  changedCoords: Vector,
  region: BlockSource
) {
  if (
    region.getBlockId(coords.x, coords.y + 1, coords.z) !== VanillaBlockID.chain
  ) {
    if(region.getBlockId(coords.x, coords.y - 1, coords.z) !== 0) {
return
    }
    region.destroyBlock(coords.x, coords.y, coords.z, true);
  };
  
}

Block.registerNeighbourChangeFunctionForID(BlockID["bottle"], destroyBottle);
Block.registerNeighbourChangeFunctionForID(
  BlockID["fireflies_bottle"],
  destroyBottle
);

Block.setRandomTickCallback(
  BlockID["fireflies_bottle"],
  (x, y, z, id, data, region) => {
    if (y >= 130 && ColdCurse.has()) {
      region.destroyBlock(x, y, z, false);
    }
  }
);

Block.registerDropFunctionForID(
  BlockID["fireflies_bottle"],
  (coords, id, data, diggingLevel, enchant, item, region) => {
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region);
    let extra: Nullable<ItemExtraData> = null;
    if (tile && tile.data && tile.data.color) {
      extra = new ItemExtraData();
      extra.putInt("color", tile.data.color || randomGlowworm());
    }
    return [[BlockID["fireflies_bottle"], 1, 0, extra]];
  }
);

Block.registerPlaceFunctionForID(
  BlockID["fireflies_bottle"],
  (coords, item, block, player, region) => {
    const relative = coords.relative;
    TileEntity.destroyTileEntityAtCoords(
      relative.x,
      relative.y,
      relative.z,
      region
    );
    region.setBlock(
      relative.x,
      relative.y,
      relative.z,
      BlockID["fireflies_bottle"],
      0
    );
    TileEntity.addTileEntity(relative.x, relative.y, relative.z);
    FirefliesBottle.setGlowwormColor(
      relative,
      region,
      (item.extra && item.extra.getInt("color", randomGlowworm())) || randomGlowworm()
    );
    return;
  }
);

namespace Plants {
  export const block_list = [
    VanillaBlockID.dirt,
    VanillaBlockID.podzol,
    VanillaBlockID.grass,
    VanillaBlockID.grass_path,
    VanillaBlockID.mycelium,
  ];
  export function registry(
    id: string,
    texture: string,
    type = BLOCK_TYPE_PLANT,
    inCreative = true
  ) {
    new FBlock(
      id,
      [
        {
          name: "block.infinite_forest." + id,
          texture: [[texture, 0]],
          inCreative: true,
        },
      ],
      type
    ).create();
    const render = new ICRender.Model();
    const model = BlockRenderer.createModel();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();
    entry.addBox(0, 0, 0, 0, 0, 0);
    BlockRenderer.setCustomCollisionShape(BlockID[id], -1, shape);
    render.addEntry(model);
  }
  export function plantFlameVine(
    coords: Vector,
    size: int,
    region: BlockSource | typeof World = World
  ) {
    let i = 1;
    for (i; i < size; i++) {
      region.setBlock(
        coords.x,
        coords.y + i,
        coords.z,
        BlockID["flame_vine"],
        0
      );
    }
    region.setBlock(
      coords.x,
      coords.y + i,
      coords.z,
      BlockID["flame_vine_top"],
      0
    );
  }
}

Plants.registry("electric_mushroom", "electric_mushroom", BLOCK_TYPE_ELECTRIC);

Plants.registry("fironia", "fironia", BLOCK_TYPE_FIRE);

Plants.registry("ice_flower", "ice_flower", BLOCK_TYPE_FIRE);

Plants.registry("flame_vine", "flame_vine");

Plants.registry("flame_vine_top", "flame_vine_top", BLOCK_TYPE_FIRE);

enum EForestPlants {
  ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
  FIRONIA = BlockID["fironia"],
  ICE_FLOWER = BlockID["ice_flower"],
}

breakBlockIfAir(EForestPlants.ELECTRIC_MUSHROOM);
breakBlockIfAir(EForestPlants.FIRONIA);
breakBlockIfAir(EForestPlants.ICE_FLOWER);
breakBlockIfAir(BlockID["flame_vine_top"]);

Block.setTempDestroyTime(EForestPlants.ELECTRIC_MUSHROOM, 20 * 60);

const vine_whitelist_blocks = [
  VanillaBlockID.magma,
  VanillaBlockID.grass,
  BlockID["flame_vine"],
];

Block.registerPlaceFunctionForID(
  BlockID["flame_vine"],
  (coords, item, block, player, region) => {
    if (
      vine_whitelist_blocks.includes(
        region.getBlockId(coords.x, coords.y, coords.z)
      ) &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) === 0
    ) {
      region.setBlock(
        coords.x,
        coords.y + 1,
        coords.z,
        BlockID["flame_vine"],
        0
      );
    }
  }
);

Block.registerNeighbourChangeFunctionForID(
  BlockID["flame_vine"],
  (coords, block, changedCoords, region) => {
    if (
      vine_whitelist_blocks.includes(
        region.getBlockId(coords.x, coords.y - 1, coords.z)
      ) === false
    ) {
      region.destroyBlock(coords.x, coords.y, coords.z, true);
    }
  }
);

Block.registerPlaceFunctionForID(
  BlockID["flame_vine_top"],
  (coords, item, block, player, region) => {
    if (
      region.getBlockId(coords.x, coords.y, coords.z) === BlockID["flame_vine"]
    ) {
      region.setBlock(
        coords.x,
        coords.y + 1,
        coords.z,
        BlockID["flame_vine_top"],
        0
      );
    }
  }
);

Block.registerNeighbourChangeFunctionForID(
  BlockID["flame_vine_top"],
  (coords, block, changedCoords, region) => {
    if (
      region.getBlockId(coords.x, coords.y - 1, coords.z) !==
      BlockID["flame_vine"]
    ) {
      region.destroyBlock(coords.x, coords.y, coords.z, true);
      return;
    }
    if (region.getBlockId(coords.x, coords.y + 1, coords.z) !== 0) {
      let end = 1;
      while (
        region.getBlockId(coords.x, coords.y - end, coords.z) ===
        BlockID["flame_vine"]
      ) {
        end++;
      }
      for (let i = 0; i < end; i++) {
        region.destroyBlock(coords.x, coords.y - i, coords.z, true);
      }
    }
  }
);

Block.setRandomTickCallback(
  BlockID["flame_vine"],
  (x, y, z, id, data, region) => {
    if (region.getBlockId(x, y + 1, z) === 0 && y < 200) {
      if (y >= 199) {
        region.setBlock(x, y + 1, z, BlockID["flame_vine_top"], 0);
        return;
      }
      if (Math.random() < 0.05) {
        region.setBlock(x, y + 1, z, BlockID["flame_vine_top"], 0);
      } else {
        region.setBlock(x, y + 1, z, BlockID["flame_vine"], 0);
      }
    }
  }
);

function fireParticle(x, y, z) {
  Particles.addParticle(
    Native.ParticleType.flame,
    x + 0.5,
    y + 0.7,
    z + 0.5,
    Math.random() / 20,
    Math.random() / 20,
    Math.random() / 20
  );
}
Block.setAnimateTickCallback(EForestPlants.FIRONIA, (x, y, z, id, data) => {
  return fireParticle(x, y, z);
});

Block.setAnimateTickCallback(BlockID["flame_vine_top"], (x, y, z, id, data) => {
  return fireParticle(x, y, z);
});

Block.setAnimateTickCallback(BlockID["flame_vine"], (x, y, z, id, data) => {
  if (Math.random() < 0.1) {
    return fireParticle(x, y, z);
  }
});

Block.registerClickFunctionForID(
  EForestPlants.FIRONIA,
  (coords, item, block, player) => {
    if (Game.getGameMode() === EGameMode.CREATIVE) return;
    Entity.setFire(player, 3, false);
  }
);

class Mushroom extends TileEntityBase {
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
    return electric_damage(player);
  }
}

TileEntity.registerPrototype(EForestPlants.ELECTRIC_MUSHROOM, new Mushroom());

Block.setRandomTickCallback(
  VanillaBlockID.brown_mushroom,
  (x, y, z, id, data) => {
    const region = BlockSource.getDefaultForDimension(InfiniteForest.id);
    if (!region) return;
    if (World.getWeather().rain === 1 && region.getLightLevel(x, y, z) >= 10) {
      region.spawnEntity(x, y, z, EEntityType.LIGHTNING_BOLT);
      region.explode(x, y, z, 0, false);
      TileEntity.destroyTileEntityAtCoords(x, y, z, region);
      region.setBlock(x, y, z, EForestPlants.ELECTRIC_MUSHROOM, 0);
      TileEntity.addTileEntity(x, y, z, region);
    }
  }
);

const electric_damage = (player) => {
  if (Game.getGameMode() === EGameMode.CREATIVE) return;
  const pos = Entity.getPosition(player);
  return Entity.damageEntity(player, 5);
};

Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
  if (block.id == EForestPlants.ELECTRIC_MUSHROOM) {
    return electric_damage(Player.get());
  }
});

Projectiles.breakBlock(BlockID["flame_vine"]);

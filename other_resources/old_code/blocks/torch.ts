class Torch {
  public block: FBlock;
  public static unlit_block: FBlock = new FBlock("eucalyptus_torch", [
    {
      name: "block.infinite_forest.eucalyptus_torch",
      texture: [["eucalyptus_torch", 0]],
      inCreative: false,
    },
  ])
    .createWithRotation()

    .setupBlockModel(
      {
        model: "block/eucalyptus_torch",
        texture: "eucalyptus_torch",
      },
      0
    );
  constructor(id: "flame" | "ice", public dust: "flame_dust" | "ice_dust") {
    id = `${id}_eucalyptus_torch` as any;
    this.block = new FBlock(
      id,
      [
        {
          name: `item.infinite_forest.${id}`,
          texture: [[id, 0]],
          inCreative: true,
        },
      ],
      BLOCK_TYPE_TORCH
    )
      .createWithRotation()
      .setupBlockModel(
        {
          model: "block/eucalyptus_torch",
          texture: id,
        },
        0
      );
  }
  public static click(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number
  ) {
    if ([ItemID["flame_dust"], ItemID["ice_dust"]].includes(item.id) === false)
      return;
    const region = BlockSource.getDefaultForActor(player);
    TileEntity.addTileEntity(coords.x, coords.y, coords.z, region);
    region.setBlock(
      coords.x,
      coords.y,
      coords.z,
      item.id === ItemID["flame_dust"]
        ? BlockID["flame_eucalyptus_torch"]
        : BlockID["ice_eucalyptus_torch"],
      block.data
    );
    for (let i = 0; i <= 6; i++) {
      Particles.addParticle(
        EForestParticle.SMOKE,
        coords.x + 0.5,
        coords.y + 0.8,
        coords.z + 0.5,
        0,
        0.01,
        0
      );
    }
  }
  static {
    Block.registerClickFunctionForID(Torch.unlit_block.getID(), Torch.click);
    BlockRegistry.setSoundType(Torch.unlit_block.getID(), "wood");
  }
}

const FLAME_TORCH = new Torch("flame", "flame_dust");
const ICE_TORCH = new Torch("ice", "ice_dust");

abstract class CursedLightning extends Curse {
  public identifier = "lightning";
  public static speedGlowworm(
    x: int,
    y: int,
    z: int,
    region: BlockSource,
    color: int
  ) {
    const entities = region.listEntitiesInAABB(
      x - 32,
      y - 8,
      z - 32,
      x + 32,
      y + 8,
      z + 32,
      EEntityType.PLAYER,
      false
    );
    //TODO: DEBUG -> entities.forEach((v) => Game.message(Entity.getTypeName(v)));
    const players = entities.filter(
      (v) => Entity.getType(v) === Native.EntityType.PLAYER
    );
    for (const player of players) {
      ParticlePacket.send(color, x + 0.5, y + 2.5, z + 0.5, 0, -0.1, 0, player);
    }
  }

  public static clouds(x: int, y: int, z: int) {
    for (let i = 0; i <= 6; i++) {
      Particles.addParticle(
        EForestParticle.CLOUD,
        x - 0.5 + randomInt(0.3, 0.6),
        y + 2.5,
        z - 0.5 + randomInt(0.3, 0.6),
        0,
        0,
        0
      );
    }
  }

  public static rain(x: int, y: int, z: int, speed: int) {
    Particles.addParticle(
      EForestParticle.VANILLA_RAIN,
      x - 0.5 + randomInt(0.3, 0.6),
      y + 2.1,
      z - 0.5 + randomInt(0.3, 0.5),
      0.01,
      -speed,
      0.01
    );
  }

  public static send(coords: Vector, speed: int, player: int) {
    CursedLightning.clouds(coords.x, coords.y, coords.z);
    CursedLightning.rain(coords.x, coords.y, coords.z, speed);
  }
}

class UnlitTorchTile extends TileEntityBase {
  public static scaled(x: int, y: int, z: int, speed: int) {
    const vectors = [[x + 0.5, y, z]]; //TODO: OLD
    for (const vector of vectors) {
      return (
        CursedLightning.clouds(vector[0], vector[1], vector[2]),
        CursedLightning.rain(vector[0], vector[1], vector[2], speed)
      );
    }
  }

  clientTick(): void {
    const region = BlockSource.getCurrentClientRegion();

    if (region.getDimension() !== InfiniteForest.id) return;

    if (World.getThreadTime() % 5 === 0) {

      CursedLightning.subscribe(() => {
        if (
          World.getWeather().rain > 0 &&
          region.canSeeSky(this.x, this.y + 1, this.z)
        ) {
          return;
        }

        let height = this.y;

        const lightlevel = region.getLightLevel(this.x, this.y, this.z);
        const speed = lightlevel < 4 ? 0.2 : lightlevel / 35;



        if (ForestUtils.hasWordInID(region.getBlockId(this.x, this.y + 1, this.z), "glass")) {
          height = this.y + 2;
          CursedLightning.clouds(this.x, height, this.z);
          CursedLightning.rain(this.x, height, this.z, speed);
        } else {
          CursedLightning.clouds(this.x, this.y, this.z);
          CursedLightning.rain(this.x, this.y, this.z, speed);
        }

        if (lightlevel >= 3) {
          UnlitTorchTile.scaled(this.x, height, this.z, speed);
        }
      });
      
    }
  }

  static {
    TileEntity.registerPrototype(
      BlockID["eucalyptus_torch"],
      new UnlitTorchTile()
    );
  }
}

Block.setRandomTickCallback(
  BlockID["flame_eucalyptus_torch"],
  (x, y, z, id, data, region) => {
    CursedLightning.speedGlowworm(x, y, z, region, randomGlowworm());
    TileEntity.destroyTileEntityAtCoords(x, y, z, region);
    region.setBlock(x, y, z, BlockID["eucalyptus_torch"], 0);
    TileEntity.addTileEntity(x, y, z, region);
  }
);

Block.setRandomTickCallback(
  BlockID["eucalyptus_torch"],
  (x, y, z, id, data, region) => {
    Entity.spawn(x, y, z, EEntityType.LIGHTNING_BOLT);
  }
);

Block.setAnimateTickCallback(
  BlockID["flame_eucalyptus_torch"],
  function (x, y, z, id, data) {
    Particles.addParticle(
      Native.ParticleType.flame,
      x + 0.5,
      y + 0.95,
      z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20
    );
  }
);

breakHasAir(BlockID["eucalyptus_torch"]);
breakHasAir(BlockID["flame_eucalyptus_torch"]);
breakHasAir(BlockID["ice_eucalyptus_torch"]);

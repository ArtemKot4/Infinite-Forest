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
        model: "eucalyptus_torch",
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
          model: "eucalyptus_torch",
          texture: id,
        },
        0
      );

    //Block.registerPlaceFunctionForID(this.block.getID(), this.place);
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
        EParticles.SMOKE,
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

class UnlitTorchTile extends TileEntityBase {
  public static clouds(x: int, y: int, z: int, player: int) {
    for (let i = 0; i <= 6; i++) {
      ForestParticle.send(
        flame_white,
        x + randomInt(0.3, 0.6),
        y + 2.5,
        z + randomInt(0.3, 0.6),
        0,
        0,
        0,
        player
      );
    }
  }
  public static rain(x: int, y: int, z: int, player: int, speed: int) {
    ForestParticle.send(
      vanilla_rain,
      x + randomInt(0.3, 0.6),
      y + 2.1,
      z + randomInt(0.3, 0.6),
      0.01,
      -speed,
      0.01,
      player
    );
  }

  onTick(): void {
    if (this.blockSource.getDimension() !== InfiniteForest.id) return;
    if (World.getThreadTime() % 5 === 0) {
      const lightlevel = this.blockSource.getLightLevel(this.x, this.y, this.z);
      const speed = lightlevel < 4 ? 0.2 : lightlevel / 35;

      UnlitTorchTile.clouds(this.x, this.y, this.z, Player.getLocal());
      UnlitTorchTile.rain(this.x, this.y, this.z, Player.getLocal(), speed);
      if (lightlevel >= 3) {
        const vectors = [
          [this.x + 1, this.y, this.z],
          [this.x - 1, this.y, this.z],
          [this.x, this.y, this.z - 1],
          [this.x, this.y, this.z + 1],
          [this.x - 1, this.y, this.z + 1],
          [this.x + 1, this.y, this.z - 1],
        ];
        for (const vector of vectors) {
          return (
            UnlitTorchTile.clouds(
              vector[0],
              vector[1],
              vector[2],
              Player.getLocal()
            ),
            UnlitTorchTile.rain(
              vector[0],
              vector[1],
              vector[2],
              Player.getLocal(),
              speed
            )
          );
        }
      }
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
    Entity.spawn(x, y, z, EEntityType.LIGHTNING_BOLT);
    TileEntity.destroyTileEntityAtCoords(x, y, z, region);
    region.setBlock(x, y, z, BlockID["eucalyptus_torch"], 0);
    TileEntity.addTileEntity(x, y, z, region);
    //  Learning.send("torch_cloud", Player.getLocal());
  }
);

Block.setRandomTickCallback(
  BlockID["eucalyptus_torch"],
  (x, y, z, id, data, region) => {
    Entity.spawn(x, y, z, EEntityType.LIGHTNING_BOLT);
    alert("!");
    //  Learning.send("torch_cloud", Player.getLocal());
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

/*
TileEntity.registerPrototype(BlockID["eucalyptus_torch"], {
  useNetworkItemContainer: true,
  tick: function () {
    this.sendPacket("spawnRain");
  },
  client: {
    events: {
      spawnRain: function () {
        if (
          World.getThreadTime() % 5 == 0 &&
          Player.getDimension() === InfiniteForest.id
        ) {
          setTickInterval(
            () =>
              Particles.addParticle(
                smoke,
                this.x + 0.5,
                this.y + 0.8,
                this.z + 0.5,
                randomInt(-0.02, 0.02),
                0.1,
                randomInt(-0.02, 0.02)
              ),
            65
          );
          for (let i = 0; i <= 6; i++) {
            Particles.addParticle(
              flame_white,
              this.x + randomInt(0.3, 0.6),
              this.y + 2.5,
              this.z + randomInt(0.3, 0.6),
              0,
              0,
              0
            );
          }

          Particles.addParticle(
            vanilla_rain,
            this.x + randomInt(0.3, 0.6),
            this.y + 2.1,
            this.z + randomInt(0.3, 0.6),
            0.01,
            -0.2,
            0.01
          );
        }
      },
    },
  },
});
*/

// const entities = this.blockSource.listEntitiesInAABB(
//   this.x - 10,
//   this.y - 10,
//   this.y - 10,
//   this.x + 10,
//   this.y + 10,
//   this.z + 10,
//   EEntityType.PLAYER,
//   false
// );
// for(const ent of entities) {
// UnlitTorchTile.clouds(this.x, this.y, this.z, ent);
// UnlitTorchTile.rain(this.x, this.y, this.z, ent);
// }

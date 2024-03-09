new AdvancedItem(
  "eucalyptus_torch",
  0,
  "Eucalyptus Torch",
  "eucalyptus_torch",
  {
    model: "eucalyptus_torch",
    onHand: true,
    importParams: {
      scale: [1.5, 1.5, 1.5],
      invertV: false,
      noRebuild: false,
    },
  }
);

const torchDrop = (block, dust) =>
  Block.registerDropFunction(
    (block || [null]) + "eucalyptus_torch",
    function (blockCoords, blockID): ItemInstanceArray[] {
      return [
        [ItemID[dust + "_dust"], 1, 0],
        [ItemID["eucalyptus_torch"], 1, 0],
      ];
    }
  );

//const registerTorchVisualPrototype = (id: string, tick: () => void) => {

//};

const UnlitTorch = new AdvancedBlock(
  "eucalyptus_torch",
  [
    {
      name: "Eucalyptus Torch",
      texture: [["eucalyptus_torch", 0]],
      inCreative: true,
    },
  ],
  {
    model: "eucalyptus_torch",
    texture: "eucalyptus_torch",
  }
);
UnlitTorch.visual();

const FlamedTorch = new AdvancedBlock(
  "flamed_eucalyptus_torch",
  [
    {
      name: "Flaming Eucalyptus Torch",
      texture: [["flaming_eucalyptus_torch", 0]],
      inCreative: true,
      data: BLOCK_TYPE_TORCH,
    },
  ],
  {
    model: "eucalyptus_torch",
    texture: "flamed_eucalyptus_torch",
  }
).visual();

const IcedTorch = new AdvancedBlock(
  "iced_eucalyptus_torch",
  [
    {
      name: "Iced Eucalyptus Torch",
      texture: [["iced_eucalyptus_torch", 0]],
      inCreative: true,
      data: BLOCK_TYPE_ICED_TORCH,
    },
  ],
  {
    model: "eucalyptus_torch",
    texture: "iced_eucalyptus_torch",
  }
).visual();

UnlitTorch.placer("eucalyptus_torch");

torchDrop("flamed", "flame");
torchDrop("iced", "ice");

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


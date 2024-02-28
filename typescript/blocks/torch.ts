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

const FlamedTorch = new AdvancedBlock(
  "flamed_eucalyptus_torch",
  [
    {
      name: "Flaming Eucalyptus Torch",
      texture: [["flaming_eucalyptus_torch", 0]],
      inCreative: true,
      data: BLOCK_TYPE_TORCH
    },
  ],
  {
    model: "eucalyptus_torch",
    texture: "flamed_eucalyptus_torch",
  }
);

const IcedTorch = new AdvancedBlock(
  "iced_eucalyptus_torch",
  [
    {
      name: "Iced Eucalyptus Torch",
      texture: [["iced_eucalyptus_torch", 0]],
      inCreative: true,
      data: BLOCK_TYPE_ICED_TORCH
    },
  ],
  {
    model: "eucalyptus_torch",
    texture: "iced_eucalyptus_torch",
  }
);

UnlitTorch.placer("eucalyptus_torch");

torchDrop("flamed", "flame");
torchDrop("iced", "ice");

TileEntity.registerPrototype(BlockID["eucalyptus_torch"], {
  useNetworkItemContainer: true,
 tick: function() {
 
  if (World.getThreadTime() % 5 == 0) {
      for(let i = 0; i <= 6; i++){
      spawnParticle(
        flame_white,
        this.x + randomInt(0.3, 0.6),
        this.y + 2.5,
        this.z + randomInt(0.3, 0.6),
        0,
        0,
        0
      );
      };

      spawnParticle(
        vanilla_rain,
        this.x + randomInt(0.3, 0.6),
        this.y + 2.1,
        this.z + randomInt(0.3, 0.6),
        0.01,
        -0.2,
        0.01
      )
    
  }
 }
});

Block.setAnimateTickCallback(BlockID["eucalyptus_torch"], (x,y,z,id,data) => {
  spawnParticle(smoke, 0.5, 0.8, 0.5, 0, 0.1, 0);
})
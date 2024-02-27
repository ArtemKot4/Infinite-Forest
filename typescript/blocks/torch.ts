const torchDrop = (block, dust) => 
Block.registerDropFunction(
  (block || [null]) + "eucalyptus_torch",
  function (blockCoords, blockID): ItemInstanceArray[] {
         return [[ItemID[dust + "_dust"], 1, 0], [ItemID["eucalyptus_torch"], 1, 0]]
  }
);

const UnlitTorch = new AdvancedBlock("eucalyptus_torch", [
  {
    name: "Eucalyptus Torch",
    texture: [["eucalyptus_torch", 0]],
    inCreative: true,
  },
], {
  model: "eucalyptus_torch", texture: "eucalyptus_torch"
});

const FlamedTorch = new AdvancedBlock("flamed_eucalyptus_torch", [
    
    {
      name: "Flaming Eucalyptus Torch",
      texture: [["flaming_eucalyptus_torch", 0]],
      inCreative: true, 
    },

  ], {
    model: "eucalyptus_torch", texture: "flamed_eucalyptus_torch"
  })

const IcedTorch = new AdvancedBlock("iced_eucalyptus_torch", [ {
    name: "Iced Eucalyptus Torch",
    texture: [["iced_eucalyptus_torch", 0]],
    inCreative: true,
  }], {
    model: "eucalyptus_torch", texture: "iced_eucalyptus_torch"
  });

new AdvancedItem(
  "eucalyptus_torch",
  0,
  "Eucalyptus Torch",
  "eucalyptus_torch",
  {
    model: "eucalyptus_torch", onHand: true
  }
);

UnlitTorch.placer("eucalyptus_torch");
UnlitTorch.onUse((coords, item, block, player, region) => {
  const minus = Entity.setCarriedItem(player, item.id, item.count - 1, 0);
  if (item.id == "flame_dust") {
    minus;
    region.setBlock(coords.x, coords.y, coords.z, BlockID["flamed_eucalyptus_torch"], 0);
  } else if (item.id == "ice_dust")
    region.setBlock(coords.x, coords.y, coords.z, BlockID["iced_eucalyptus_torch"], 0);
});



torchDrop("flamed", "flame");
torchDrop("iced", "ice");
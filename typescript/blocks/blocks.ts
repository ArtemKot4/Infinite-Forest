IMPORT("SoundAPI");


IDRegistry.genBlockID("eucalyptus_log");
Block.createBlock(
  "eucalyptus_log",
  [
    {
      name: "Eucaluptus",
      texture: [
        ["eucalyptus", 0],
        ["eucalyptus", 0],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
      ],
      inCreative: true,
    },
    {
      name: "Eucaluptus",
      texture: [
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 0],
        ["eucalyptus", 0],
      ],
      inCreative: false,
    },
    {
      name: "Eucaluptus",
      texture: [
        ["eucalyptus", 1],
        ["eucalyptus", 1],
        ["eucalyptus", 0],
        ["eucalyptus", 0],
        ["eucalyptus", 1],
        ["eucalyptus", 1],
      ],
      inCreative: false,
    },
  ],
  "opaque"
);

IDRegistry.genBlockID("bark_eucalyptus");
Block.createBlock("bark_eucalyptus", [
  {
    name: "Bark Eucalyptus",
    texture: [
      ["eucalyptus_bark", 0],
      ["eucalyptus_bark", 0],
      ["bark_eucalyptus", 0],
      ["bark_eucalyptus", 0],
      ["bark_eucalyptus", 0],
      ["bark_eucalyptus", 0],
    ],
    inCreative: true,
  },
]);

IDRegistry.genBlockID("bark_pink");
Block.createBlock("bark_pink", [
  {
    name: "Bark Pink Log",
    texture: [
      ["barkPink", 0],
      ["barkPink", 0],
      ["barkPink", 1],
      ["barkPink", 1],
      ["barkPink", 1],
      ["barkPink", 1],
    ],
    inCreative: true,
  },
]);

Block.setDestroyTime(BlockID.eucalyptus_log, 0.4);
ToolAPI.registerBlockMaterial(BlockID.eucalyptus_log, "wood");
Translation.addTranslation("Eucaluptus", { ru: "§aЭвкалипт" });
Block.createBlock(
  "pink_log",
  [
    {
      name: "Pink Wood",
      texture: [
        ["pinkWood", 0],
        ["pinkWood", 0],
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 1],
      ],
      inCreative: true,
    },
    {
      name: "Pink Wood",
      texture: [
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 0],
        ["pinkWood", 0],
      ],
      inCreative: false,
    },
    {
      name: "Pink Wood",
      texture: [
        ["pinkWood", 1],
        ["pinkWood", 1],
        ["pinkWood", 0],
        ["pinkWood", 0],
        ["pinkWood", 1],
        ["pinkWood", 1],
      ],
      inCreative: false,
    },
  ],
  "opaque"
);
Block.registerDropFunction("pink_log", function (coords, blockID) {
  return [[BlockID.pink_log, 1, 0]];
});

Block.setDestroyTime(BlockID.pink_log, 0.4);
Block.setDestroyTime(BlockID.eucalyptus_log, 0.4);
ToolAPI.registerBlockMaterial(BlockID.pink_log, "wood");





IDRegistry.genBlockID("pink_planks");
Block.createBlock("pink_planks", [
  { name: "Pink planks", texture: [["pink_planks", 0]], inCreative: true },
]);


IDRegistry.genBlockID("eucalyptus_planks");
Block.createBlock("eucalyptus_planks", [
  {
    name: "Eucalyptus planks",
    texture: [["eucalyptus_planks", 0]],
    inCreative: true,
  },
]);

IDRegistry.genBlockID("hewn_eucalyptus");
Block.createBlock("hewn_eucalyptus", [
  { name: "Eucalyptus hewn", texture: [["eucalyptus", 1]], inCreative: true },
]);


IDRegistry.genBlockID("hewn_pink_log");
Block.createBlock("hewn_pink_log", [
  { name: "Pink hewn", texture: [["pinkWood", 1]], inCreative: true },
]);


IDRegistry.genBlockID("dungeon_print_bricks");
Block.createBlock("dungeon_print_bricks", [
  {
    name: "Dungeon old brick",
    texture: [["dungeon_brick", 0]],
    inCreative: true,
  },
]);

ToolAPI.registerBlockMaterial(BlockID.dungeon_print_bricks, "unbreaking", 4);
IDRegistry.genBlockID("dungeon_print_bricks_active");
Block.createBlock(
  "dungeon_print_bricks_active",
  [
    {
      name: "Dungeon print active brick",
      texture: [["mysterious print", 0]],
      inCreative: false,
    },
  ],
  BLOCK_TYPE_PRINT
);

IDRegistry.genBlockID("dungeon_print_bricks_active_1");
Block.createBlock(
  "dungeon_print_bricks_active_1",
  [
    {
      name: "Dungeon print active brick",
      texture: [["print color", 0]],
      inCreative: false,
    },
  ],
  BLOCK_TYPE_PRINT
);

IDRegistry.genBlockID("dungeon_print_bricks_deactive");
Block.createBlock("dungeon_print_bricks_deactive", [
  {
    name: "Dungeon print deactive brick",
    texture: [["deactive print", 0]],
    inCreative: true,
  },
]);

ToolAPI.registerBlockMaterial(
  BlockID.dungeon_print_bricks_deactive,
  "unbreaking",
  4
);


new FBlock("salt", [{
  name: "Salt",
  texture: [["salt", 0]],
  inCreative: true
}]);

type tree = 'cherry' | 'eucalyptus' | 'pink';
class Wood {
  public static registerLog(type: tree) {
    const name = (type + "_log")
    new FBlock(name, [
    {
      name,
      texture: [
        [type, 0],
        [type, 0],
        [type, 1],
        [type, 1],
        [type, 1],
        [type, 1],
      ],
      inCreative: true,
    },
    {
      name,
      texture: [
        [type, 1],
        [type, 1],
        [type, 1],
        [type, 1],
        [type, 0],
        [type, 0],
      ],
      inCreative: false,
    },
    {
      name,
      texture: [
        [type, 1],
        [type, 1],
        [type, 0],
        [type, 0],
        [type, 1],
        [type, 1],
      ],
      inCreative: false,
    },
  ],
  );
  Wood.placeLogBySide(BlockID[name])
};
  private static placeLogBySide (type) {

    const hasSide = (coords: Callback.ItemUseCoordinates, side: EBlockSide, region: BlockSource, type) => {
      if(coords.side != side) return;
      const place = coords.relative
      region.setBlock(place.x, place.y, place.z, type, side)
    };

    Block.registerPlaceFunctionForID(type, (coords, item, block, player, region) => {
      hasSide(coords, EBlockSide.EAST, region, type);
      hasSide(coords, EBlockSide.SOUTH, region, type);
      hasSide(coords, EBlockSide.WEST, region, type);
      hasSide(coords, EBlockSide.NORTH, region, type)
    })
  }
};

Wood.registerLog("cherry")
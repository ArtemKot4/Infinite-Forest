IMPORT("SoundAPI");

IDRegistry.genBlockID("fironia");
Block.createBlock(
  "fironia",
  [{ name: "Fironia", texture: [["fironia", 0]], inCreative: true }],
  BLOCK_TYPE_FIRE
);

Block.setAnimateTickCallback(BlockID.fironia, function(x, y, z, id, data) {
 Particles.addParticle(Native.ParticleType.flame,x+0.5,y+0.7,z+0.5,Math.random()/20,Math.random()/20,Math.random()/20)
});

var render1 = new ICRender.Model();
var model1 = BlockRenderer.createModel();
var Fironiashape = new ICRender.CollisionShape();
var entry = Fironiashape.addEntry();
entry.addBox(0, 0, 0, 0, 0, 0);
BlockRenderer.setCustomCollisionShape(BlockID.fironia, -1, Fironiashape);

render1.addEntry(model1);
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
Recipes.addShaped(
  { id: BlockID.pink_planks, count: 4, data: 2 },
  ["vvv", "vlv", "vvv"],
  ["l", BlockID.pink_log, -1]
);
Recipes.addShaped(
  { id: BlockID.eucalyptus_planks, count: 4, data: 2 },
  ["vvv", "vlv", "vvv"],
  ["l", BlockID.eucalyptus_log, -1]
);
Block.setDestroyTime(BlockID.pink_log, 0.4);
Block.setDestroyTime(BlockID.eucalyptus_log, 0.4);
ToolAPI.registerBlockMaterial(BlockID.pink_log, "wood");

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.eucalyptus_log, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.pink_log, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.pink_planks, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.eucalyptus_planks, 0]
);



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



TileEntity.registerPrototype(BlockID.dungeon_print_bricks_active, {
  defaultValues: { onemessage: 0 },
  useNetworkItemContainer: true,
  tick: function () {
    Opening.play();
    if (World.getThreadTime() % 60 == 0) {
      this.blockSource.destroyBlock(this.x, this.y, this.z, false);
      this.blockSource.destroyBlock(this.x, this.y - 1, this.z, false);
      this.blockSource.destroyBlock(this.x, this.y + 1, this.z, false);
      this.blockSource.destroyBlock(this.x + 1, this.y - 1, this.z, false);
      this.blockSource.destroyBlock(this.x + 1, this.y + 1, this.z, false);
      this.blockSource.destroyBlock(this.x + 1, this.y, this.z, false);

      this.blockSource.setBlock(
        this.x - 1,
        this.y - 1,
        this.z - 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );
      this.blockSource.setBlock(
        this.x - 1,
        this.y - 1,
        this.z - 2,
        BlockID.dungeon_print_bricks_deactive,
        0
      );
      this.blockSource.setBlock(
        this.x - 1,
        this.y,
        this.z - 1,
        BlockID.dungeon_print_bricks_active_1,
        0
      );
      this.blockSource.setBlock(
        this.x - 1,
        this.y,
        this.z - 2,
        BlockID.dungeon_print_bricks_deactive,
        0
      );
      this.blockSource.setBlock(
        this.x - 1,
        this.y + 1,
        this.z - 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );
      this.blockSource.setBlock(
        this.x - 1,
        this.y + 1,
        this.z - 2,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      if (this.data.onemessage == 0) {
        Game.message("§9Вы можете идти");
        this.data.onemessage += 1;
      }
    }
  },
  // destroy: function (id,count,data,coords,block){

  // }
});

TileEntity.registerPrototype(BlockID.dungeon_print_bricks_active_1, {
  defaultValues: { onemessage: 0 },
  useNetworkItemContainer: true,
  tick: function () {
    Opening.play();
    if (World.getThreadTime() % 60 == 0) {
      this.blockSource.destroyBlock(this.x, this.y, this.z, false);
      this.blockSource.destroyBlock(this.x, this.y - 1, this.z, false);
      this.blockSource.destroyBlock(this.x, this.y + 1, this.z, false);
      this.blockSource.destroyBlock(this.x, this.y - 1, this.z + 1, false);
      this.blockSource.destroyBlock(this.x, this.y + 1, this.z + 1, false);
      this.blockSource.destroyBlock(this.x, this.y, this.z + 1, false);
      this.blockSource.destroyBlock(this.x, this.y - 1, this.z - 1, false);
      this.blockSource.destroyBlock(this.x, this.y + 1, this.z - 1, false);
      this.blockSource.destroyBlock(this.x, this.y, this.z - 1, false);

      this.blockSource.setBlock(
        this.x,
        this.y,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x,
        this.y - 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x,
        this.y + 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x + 1,
        this.y - 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x + 1,
        this.y + 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x + 1,
        this.y,
        this.z + 1,
        BlockID.dungeon_print_bricks_active,
        0
      );

      this.blockSource.setBlock(
        this.x + 2,
        this.y - 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x + 2,
        this.y + 1,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      this.blockSource.setBlock(
        this.x + 2,
        this.y,
        this.z + 1,
        BlockID.dungeon_print_bricks_deactive,
        0
      );

      if (this.data.onemessage == 0) {
        Game.message("§9Вы можете идти");
        this.data.onemessage += 1;
      }
    }
  },
  // destroy: function (id,count,data,coords,block,id){

  // }
});


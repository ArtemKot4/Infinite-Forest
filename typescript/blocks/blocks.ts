IMPORT("SoundAPI");

new FBlock("salt", [
  {
    name: "Salt",
    texture: [["salt", 0]],
    inCreative: true,
  },
]).create();

Block.setDestroyLevel("salt", MiningLevel.STONE);

type tree = "cherry" | "eucalyptus" | "pink";

IMPORT("SoundAPI");

new FBlock("salt", [
  {
    name: "Salt",
    texture: [["salt", 0]],
    inCreative: true,
  },
]);

Block.setDestroyLevel("salt", EDestroyLevel.WOOD);

type tree = "cherry" | "eucalyptus" | "pink";



IDRegistry.genBlockID("infinite_table");
Block.createBlock("infinite_table", [
  {
    name: "Infinite infinite_table",
    texture: [
      ["eucalyptus", 1],
    ],
    inCreative: true,
  },
]);

class InfiniteAltar extends TileEntityBase {
  useNetworkItemContainer: true;
  defaultValues = {};
  public onTick(): void {
    if(this.dimension == 75){
     // Particles.addParticle("spark", 0.5, 1.4, 0.5);
    };
  }
}

const infinite_recipes = new WorkbenchRecipe();
infinite_recipes.registry(ItemID["parchment_lazuli"], [
  "abc",
  "dhc",
  "bca"], {
a: 25, b: 7, c: 3, d: 9, h: 63,
});


TileEntity.registerPrototype(BlockID.infinite_table, new InfiniteAltar());

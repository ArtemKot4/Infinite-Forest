Callback.addCallback("ItemUse", (coords, item, block, isExter, player) => {
  if (Entity.getSneaking(player)) {
    if (item.id == ItemID.blue_crystal) {
      Dimensions.transfer(player, InfiniteForest.id);
    }
    if (item.id == ItemID.orange_crystal) {
      Dimensions.transfer(player, 0);
    }
  }
  if (item.id == VanillaItemID.stick) {
    var a = coords.relative;
    Particles.addParticle(star, a.x + 0.5, a.y + 0.7, a.z + 0.5, 0, -0.1, 0);
  }
  if (item.id == VanillaItemID.diamond) {
    spawnStars(Player.getPosition());
  }
  if (
    item.id == ItemID.parchment_gold &&
    block.id == BlockID.dungeon_print_bricks_deactive
  ) {
    var region = BlockSource.getDefaultForActor(player);
    if (
      region.getBlockId(coords.x, coords.y - 1, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x + 1, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x - 1, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive
    ) {
      region.setBlock(
        coords.x,
        coords.y,
        coords.z,
        BlockID.dungeon_print_bricks_active,
        0
      );

      Mistical.play();
    }
  }

  if (
    item.id == ItemID.parchment_lazuli &&
    block.id == BlockID.dungeon_print_bricks_deactive
  ) {
    var region = BlockSource.getDefaultForActor(player);
    if (
      region.getBlockId(coords.x, coords.y - 1, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x + 1, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive &&
      region.getBlockId(coords.x - 1, coords.y, coords.z) ==
        BlockID.dungeon_print_bricks_deactive
    ) {
      region.setBlock(
        coords.x,
        coords.y,
        coords.z,
        BlockID.dungeon_print_bricks_active_1,
        0
      );

      Mistical.play();
    }
  }
});


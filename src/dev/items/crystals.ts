IDRegistry.genItemID("blue_crystal");
Item.createItem("blue_crystal", "Blue crystal", { name: "blue_crystal" },{stack: 1,isTech: false});

IDRegistry.genItemID("orange_crystal");
Item.createItem("orange_crystal", "Orange crystal", { name: "orange_crystal" },{stack: 1,isTech: false});

IDRegistry.genItemID("flame_crystal");
Item.createItem("flame_crystal", "Flame crystal", { name: "flame_crystal" },{stack: 1,isTech: true});

IDRegistry.genItemID("void_crystal");
Item.createItem("void_crystal", "Void crystal", { name: "void_crystal" }, {stack: 1,isTech: true});

// IAHelper.makeAdvancedAnim(
//   ItemID.flame_crystal,
//   "flame_crystal",
//   2,
//   [1, 2, 3, 4]
// );

function getCoords (): void {
  var players = Network.getConnectedPlayers();

  for (const i in players) {
  const position = Entity.getPosition(Number(players))
    const a = [];
    a.push(position);
    Game.message(JSON.stringify(a))
    Game.message(JSON.stringify(position))
  }
}

Item.registerUseFunction(
  ItemID["flame_crystal"],
  function (coords, item, block, player) {
    getCoords()
    let place = coords.relative;
    if (Entity.getSneaking(player))
      BlockSource.getDefaultForActor(player).setBlock(
        place.x,
        place.y,
        place.z,
        VanillaBlockID.fire,
        0
      );
    else if (Entity.getSneaking(player) == false) {
      if (Entity.getDimension(player) == InfiniteForest.id)
        Dimensions.transfer(player, 0);
      else {
        Dimensions.transfer(player, InfiniteForest.id);
      }
    }
  }
);

Item.registerNameOverrideFunction(
  ItemID.flame_crystal,
  function (item, translation, name) {
    var players = Network.getConnectedPlayers();

    for (var i in players) {
      if (Entity.getDimension(Number(players)) != InfiniteForest.id) {
        return "§9" + Translation.translate(name);
       
      } else if (Entity.getDimension(Number(players)) == InfiniteForest.id) {
        return "§6" + Translation.translate(name);
      }
    }
  }
);

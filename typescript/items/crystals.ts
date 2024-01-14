
new FItem("blue_crystal", 1);
new FItem("orange_crystal");

IDRegistry.genItemID("flame_crystal");
Item.createItem("flame_crystal", "Flame crystal", { name: "flame_crystal" },{stack: 1,isTech: true});

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


new FItem("blue_crystal", 1).onUse((coords,item,block)=>{
  Dimensions.transfer(Player.get(), 75)
})
new FItem("orange_crystal", 1).onUse((coords,item,block)=>{
  Dimensions.transfer(Player.get(), 75)
})

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


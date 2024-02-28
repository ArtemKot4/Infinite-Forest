
new FItem("blue_crystal", 1);
new FItem("orange_crystal");

function getCoords (): void {
  const players = Network.getConnectedPlayers();

  for (const i in players) {
  const position = Entity.getPosition(Number(players))
    const a = [];
    a.push(position);
    Game.message(JSON.stringify(a))
    Game.message(JSON.stringify(position))
  }
};


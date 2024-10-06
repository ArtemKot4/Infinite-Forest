
Callback.addCallback("LevelDisplayed", () => {
    const players = Network.getConnectedPlayers()
    for(const i in players) {
      const name = Entity.getNameTag(players[i]);
       Book.GraphicUI.initializeSections(name);
       Game.message(JSON.stringify( Book.GraphicUI.pagesList[name]))
    }
  })
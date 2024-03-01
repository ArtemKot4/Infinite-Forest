Callback.addCallback("LevelDisplayed", () => {
  const players = Network.getConnectedPlayers();
  for (const i in players) {
    const player_data = Researchs.player_data;
    if (player_data && !player_data[players[i]]) {
      
      player_data[players[i]] = {
        completed: {},
        questions: [],
        UIData: { container: new UI.Container(), ui: null },
      };
    }
    Game.message(
      String("debug if.question boolean: " + (players[i] in player_data))
    );
  }
  Game.message(
    "Researchs player_data: " + JSON.stringify(Researchs.player_data)
  );
});


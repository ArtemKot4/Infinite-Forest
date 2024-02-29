Callback.addCallback("LevelDisplayed", () => {

  Network.addClientPacket("if.question", (packetData: { player; question }) => {
    Game.message(packetData.question || "Error! Underknown question");
    const question = Researchs.player_data[packetData.player]["questions"];
    if (question && question.includes(packetData.question)) return false;
    question.push(packetData.question);
  });

  const players = Network.getConnectedPlayers();
  for (const i in players) {
    if (!(players[i] in Researchs.player_data)) {
      Game.message(
        String("debug if.question: " + !(players[i] in Researchs.player_data))
      );
      Researchs.player_data[players[i]] = {
        completed: {},
        questions: [],
        UIData: { container: new UI.Container(), ui: null },
      };
    }
  }
  Game.message(
    "Researchs player_data: " + JSON.stringify(Researchs.player_data)
  );
});

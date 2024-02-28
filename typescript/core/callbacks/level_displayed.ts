Callback.addCallback("LevelDisplayed", () => {
    const players = Network.getConnectedPlayers();
    for(const i in players) {
        if(!(players[i] in Researchs.player_data)) {
            alert("!(players[i] in Researchs.player_data)")
            Researchs.player_data[players[i]] = {completed: {}, questions: [], UIData: {container: new UI.Container(), ui: null}};
        }
    };
    Game.message("Researchs player_data: " + JSON.stringify(Researchs.player_data));
})
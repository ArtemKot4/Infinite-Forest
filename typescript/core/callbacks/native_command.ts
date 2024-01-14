var cmd = [];
function commandRegistry(description: string, action: () => void,msg?: string) {
  cmd.push({ description: description, action: action,msg: msg });
}

commandRegistry("tp @p to infinite forest", () => {
  Dimensions.transfer(Player.getLocal(), InfiniteForest.id);
}, 
"Player teleported to Infinite forest");

commandRegistry("tp @p to overworld", () => {
  Dimensions.transfer(Player.getLocal(), 0);
},
 "Player teleported to overworld");

commandRegistry("help", () => {
  Game.message(
    "1. /if:tp @p to infinite forest\n2. /if:tp @p to overworld\n3. /if:help"
  );
});

Callback.addCallback("NativeCommand", (command) => {
  for (var i in cmd) {
    if (command == "/if:" + cmd[i].description || command == "!if:" + cmd[i].description) {
      cmd[i].action();
      if(cmd[i].msg!=undefined){
        Game.message(Translation.translate(cmd[i].msg))
    }
    }
   
  }
});

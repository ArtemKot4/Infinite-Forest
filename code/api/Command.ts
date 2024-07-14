Callback.addCallback("NativeCommand", (command) => {
  const splited = command.split(" ");
  if (splited[0].includes("/if:")) {
    for (const i in Command.list) {
      for (const list of Command.list[i]) {
        if (splited.length >= list.args.length) {
          Game.prevent();
          for (const k in splited) {
            if (splited[k] !== list.args[k]) {
              return BlockEngine.sendUnlocalizedMessage(
                Network.getClientForPlayer(Player.getLocal()),
                "unvalid command"
              );
            }
          }
        }
        list.func(splited, list.args);
      }
    }
  }
});

abstract class Command {
  public static list: Record<
    int,
    { args: string[]; func: (str: string[], args: string[]) => void }[]
  > = {};
  public static registerCommand(
    func: (str: string[], args: string[]) => void,
    ...args: string[]
  ) {
    (Command.list[args.length] ??= []).push({ args: args, func: func });
  }
}

Command.registerCommand(
  (str, args) => {
    const client = Network.getClientForPlayer(Player.getLocal());
    if (str[2] !== undefined) {
      if (BookUI.getPagesFor(str[3])) {
        delete BookUI.pagesList[str[3]];
        BlockEngine.sendUnlocalizedMessage(
          client,
          "test pages has been deleted from " + str[3]
        );
      }
    } else {
      BlockEngine.sendUnlocalizedMessage(client, "player undefined arg");
    };
    return;
  },
  "learning",
  "delete"
);

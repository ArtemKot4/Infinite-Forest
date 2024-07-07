class Learning {
  public static list: Record<name, name[]> = {};
  constructor(public name: string, public message: string) {}
  public send(player: int, color: Native.Color = Native.Color.GREEN) {
    const client = Network.getClientForPlayer(player);
    if (!client) return;
    const name = Entity.getNameTag(player);
    BlockEngine.sendUnlocalizedMessage(
      client,
      `<${player}> ${Translation.translate(
        "learning.infinite_forest." + this.message
      )}`
    );
    Learning.list[name].push(this.name);
  };
  public static sendReflection(player: int, name: string, message: string, ...learnings: Learning[]) {
    for(const learning of learnings) {
      if(learning.has(player) === false) return;
    };
    new Learning(name, message)
  }
  public has(player: int) {
    return Learning.list?.[Entity.getNameTag(player)].includes(this.name);
  };
}

Callback.addCallback("LevelDisplayed", () => {
  const name = Entity.getNameTag(Player.getLocal());
  Learning.list[name] ??= [];
});

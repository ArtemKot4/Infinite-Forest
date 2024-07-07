class Reflection {
  public learnings: Learning[] = [];
  public static list: Record<name, name[]>;
  constructor(
    public name: string,
    public message: string,
    public bookPage: string,
    ...learnings: Learning[]
  ) {
    this.learnings = learnings;
  }
  public hasLearnings(player: int) {
    Game.message(JSON.stringify(Learning.list?.[player]))
    for (const learning of this.learnings) {
      if (!Learning.list?.[player].includes(learning.name)) return false;
    }
    return true;
  }
  public send(player: int) {
    if (!this.hasLearnings(player)) return;
    const client = Network.getClientForPlayer(player);
    if (!client) return;
    const name = Entity.getNameTag(player);
    BlockEngine.sendUnlocalizedMessage(
      client,
      Native.Color.GREEN +
        Translation.translate("message.infinite_forest.reflection")
    );
    Reflection.list[name].push(this.name);
  };
}

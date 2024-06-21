class Learning {
  public static list: Record<string, string>;
  public static shared_list: Record<string, Record<string, boolean>>
  constructor(public name: string, public message: string) {
    Learning.list[name] = message
  }
  public static send(name: string, player: int) {
    // const tag = Entity.getNameTag(player);
    // const list = Learning.shared_list?.[tag]?.[name] ?? false;
    // if (list === true) return;
    // Learning.shared_list[tag][name] = true;
    // BlockEngine.sendUnlocalizedMessage(
    //   Network.getClientForPlayer(player),
    //   Native.Color.GRAY + Translation.translate(Learning.list[name])
    // );
  };
  public static check(player: int, name: string) {
    const tag = Entity.getNameTag(player);
    return !!Learning.shared_list[tag][name];
  };
};

// new Learning("torch_cloud", "learning.infinite_forest.torch_cloud");

// Translation.addTranslation("learning.infinite_forest.torch_cloud", {
// ru: "Хм... И почему мои древесные огни, не могут просто загореться?"
// })
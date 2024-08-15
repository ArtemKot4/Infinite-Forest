type ServerPlayerFlags = "insightMode";

abstract class ServerPlayerFlagPacket {
  protected constructor() {}
  static updateTo(player: int) {
    Network.getClientForPlayer(player).send(
      "packet.infinite_forest.send_flags_to_server",
      ServerPlayer.get(player)
    );
  }
  static {
    Network.addClientPacket(
      "packet.infinite_forest.send_flags_to_server",
      (data: ServerPlayerFlags[]) => {
        ServerPlayer.list[Player.getLocal()] = data;
      }
    );
  }
}

class ServerPlayer {
  static list: Record<playerName, ServerPlayerFlags[]> = {};
  public static get(uid: int) {
    return (ServerPlayer.list[Entity.getTypeName(uid)] ??= []);
  }
  public static getFlag(uid: int, flag: ServerPlayerFlags) {
    return (
      ServerPlayer.list?.[Entity.getTypeName(uid)]?.includes(flag) === true
    );
  }
  public static setFlag(uid: int, flag: ServerPlayerFlags) {
    this.get(uid).push(flag);
    ServerPlayerFlagPacket.updateTo(uid);
  }
  public static deleteFlag(uid: int, flag: ServerPlayerFlags) {
    const name = Entity.getTypeName(uid);
    const currentPlayer = this.get(uid);
    const index = currentPlayer.findIndex((v) => v === flag);
    if (index > -1) {
      currentPlayer.splice(index, 1);
    }
    ServerPlayerFlagPacket.updateTo(uid);
    return;
  }
}

class ServerPlayer {
  protected static flags: Record<playerName, Record<string, any>> = {};

  @onLevelDisplayed
  public static initialize() {
    const playerList = Network.getConnectedPlayers();

    for (const i in playerList) {
      Network.sendToServer(
        "packet.infinite_forest.ServerPlayer.initializeFlagList",
        {
          player: playerList[i],
        }
      );
    }
  }

  public static setFlag<T>(player: int, name: string, value: T) {
    const playerName = Entity.getNameTag(player);
    ServerPlayer.flags[playerName][name] = value;
  }

  public static setFlagFromClient<T>(player: int, name: string, value: T) {
    Network.sendToServer("packet.infinite_forest.ServerPlayer.setFlag", {
      player,
      name,
      value,
    });
  }

  public static deleteFlag(player: int, name: string) {
    delete ServerPlayer[Entity.getNameTag(player)][name];
  }

  public static deleteFlagClient(player: int, name: string) {
    Network.sendToServer("packet.infinite_forest.ServerPlayer.deleteFlag", {
      player,
      name,
    });
  }

  public static getFlag<T>(player: int, name: string, fallback?: T) {
    return ServerPlayer.flags[Entity.getNameTag(player)][name] || fallback;
  }

  public static getFlagFromServer<T>(player: int, name: string, fallback?: T) {
    Network.getClientForPlayer(player).send(
      "packet.infinite_forest.ServerPlayer.getFlag",
      { player, name }
    );
    return this.getFlag(player, name, fallback);
  }

  static {
    Network.addClientPacket(
      "packet.infinite_forest.ServerPlayer.initializeFlagList",
      (data: { player: int }) => {
        const playerName = Entity.getNameTag(data.player);

        ServerPlayer.flags[playerName] ??= {};
      }
    );

    Network.addClientPacket(
      "packet.infinite_forest.ServerPlayer.setFlag",
      (data: { player: int; name: string; value: any }) => {
        const playerName = Entity.getNameTag(data.player);

        ServerPlayer.flags[playerName][data.name] = data.value;
      }
    );

    Network.addClientPacket(
      "packet.infinite_forest.ServerPlayer.deleteFlag",
      (data: { player: int; name: string }) => {
        const playerName = Entity.getNameTag(data.player);

        delete ServerPlayer.flags[playerName][data.name];
      }
    );

    Network.addServerPacket(
      "packet.infinite_forest.ServerPlayer.getFlag",
      (client: NetworkClient, data: { player: int; name: string }) => {
        const playerName = Entity.getNameTag(data.player);

        client.send("packet.infinite_forest.ServerPlayer.setFlag", {
          player: data.player,
          name: data.name,
          value: ServerPlayer.flags[playerName][data.name],
        });
      }
    );
  }
}

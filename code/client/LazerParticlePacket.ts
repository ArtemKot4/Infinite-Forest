abstract class LazerParticlePacket extends ClientPacket {
  static LAZER_DISTANCE = 0.05;
  static identifier: string = "packet.infinite_forest.lazer_particles";
  static function(packetData: { player: int }) {
    const vector = Entity.getLookVector(packetData.player);
    const position = Entity.getPosition(packetData.player);
    for (let distance = 0.12; distance <= 0.16; distance++) {
      ParticlePacket.send(
        EForestParticle.INSIGHT_VIEW,
        position.x + vector.x * distance,
        position.y + vector.y * 0.12,
        position.z + vector.z * 0.12,
        vector.x * LazerParticlePacket.LAZER_DISTANCE,
        vector.y * LazerParticlePacket.LAZER_DISTANCE + 0.05,
        vector.z * LazerParticlePacket.LAZER_DISTANCE,
        packetData.player
      );
    }

    // const vector = Entity.getLookVector(packetData.player);
    // const position = Entity.getPosition(packetData.player);
    // Game.message("in packet")
    // for (let distance = 0.12; distance < 7; distance += 0.05) {
    //   Particles.addParticle(
    //     EForestParticle.INSIGHT_VIEW,
    //     position.x + vector.x * distance,
    //     position.y + vector.y * 0.12,
    //     position.z + vector.z * 0.12,
    //     vector.x * this.LAZER_DISTANCE + 0.05,
    //     vector.y  * this.LAZER_DISTANCE,
    //     vector.z  * this.LAZER_DISTANCE
    //   );
    // }
    return;
  }
  public static send(player: int) {
    const client = Network.getClientForPlayer(player);
    if (!client) {
      return;
    }
    client.send("packet.infinite_forest.lazer_particles", {
      player: player,
    });
    return;
  }
}

Network.addClientPacket(
  LazerParticlePacket.identifier,
  LazerParticlePacket.function
);

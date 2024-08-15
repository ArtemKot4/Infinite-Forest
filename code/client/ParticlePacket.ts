abstract class ParticlePacket extends ClientPacket {
    static identifier: string = "packet.infinite_forest.particles";
    static action(packetData: IParticleSenderDescriptor) {
        Particles.addParticle(
          packetData.type,
          packetData.x,
          packetData.y,
          packetData.z,
          packetData.vx,
          packetData.vy,
          packetData.vz
        );
      }
    public static send(
      type: EForestParticle | EParticleType,
      x: int,
      y: int,
      z: int,
      vx: int,
      vy: int,
      vz: int,
      player: int
    ) {
      const client = Network.getClientForPlayer(player);
      if (!client) return;
      client.send(this.identifier, { type, x, y, z, vx, vy, vz });
    }
  }

  Network.addClientPacket(ParticlePacket.identifier, ParticlePacket.action)
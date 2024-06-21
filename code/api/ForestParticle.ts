
class ForestParticle {
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
      client.send("infinite_forest.particles", { type, x, y, z, vx, vy, vz });
    }
  }
  
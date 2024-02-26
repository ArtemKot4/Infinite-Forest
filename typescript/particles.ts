Network.addClientPacket("if.particle", function (packetData: any) {
    Particles.addParticle(
      packetData.p,
      packetData.x,
      packetData.y, 
      packetData.z,
      packetData.vx,
      packetData.vy,
      packetData.vz
    );
  });
  
  function spawnParticle(type, x, y, z, vx, vy, vz, ax, ay?, az?) {
    vx = vx || 0;
    vy = vy || 0;
    vz = vz || 0;
    ax = ax || 0;
    ay = ay || 0;
    az = az || 0;
    var players = Network.getConnectedPlayers();
    for (var i in players) {
      var client = Network.getClientForPlayer(players[i]);
      if (client) {
        client.send("if.particle", {
          p: type,
          x: x,
          y: y,
          z: z,
          vx: vx,
          vy: vy,
          vz: vz,
        });
        /*  Debug.message("spawn particle");*/
      } else {
        Debug.message("[Error] Failed spawn particle");
      }
    }
  }

  
const glowworm = Particles.registerParticleType({
    texture: "part_1",
    render: 2,
    size: [1, 3],
    lifetime: [40, 100],
  
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  });
  
  
   const flame_blue = Particles.registerParticleType({
    texture: "flame_blue",
    render: 2,
    size: [2, 3],
    lifetime: [5, 15],
  
   // color: [253,156,0,1],
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  });
  
  const flame_orange = Particles.registerParticleType({
    texture: "flame",
    render: 2,
    size: [4, 5],
    lifetime: [20, 15],
    color: [0,84,255,1],
  
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  });
  
  const flame_white = Particles.registerParticleType({
    texture: "flame",
    render: 2,
   // color: [1, 0.5, 0.5, 0.5],
    size: [4,5],
    lifetime: [20, 15],
  
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  });
  
  
  const star = Particles.registerParticleType({
    texture: "flame",
    render: 0,
    size: [8,9],
    lifetime: [80, 100],
  
    animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
    },
  });
  
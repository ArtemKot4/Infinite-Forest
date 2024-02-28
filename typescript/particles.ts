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
  
  function spawnParticle(type, x, y, z, vx = 0, vy = 0, vz = 0) {
    const players = Network.getConnectedPlayers();
    for (const i in players) {
      const client = Network.getClientForPlayer(players[i]);
      if (!client) return;
   
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
    size: [6,9,],
    lifetime: [20, 15],
  
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  })
  
  
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
  
  const smoke = Particles.registerParticleType({
    texture: "smoke",
    render: 0,
    size: [.3, .],
    lifetime: [80, 100],
   
    animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
    },
  });
  
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
  

  const flame_white = Particles.registerParticleType({
    texture: "flame",
    render: 2,
    color: [165/255, 165/255, 165/255, 1],
    size: [6,9,],
    lifetime: [30, 40],
  
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
    render: 1,
    size: [0.5,1],
    lifetime: [80, 100],
   
    animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
    },
  });
  
  const vanilla_rain = Particles.registerParticleType({
    texture: "weather",
    render: 2,
    size: [3,4],
    lifetime: [80, 100],
   
    animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
    },
  }); 

  const cauldron_bubble = Particles.registerParticleType({
    texture: "bubble_cauldron",
    render: 2,
    size: [0.7, 1.2],
    lifetime: [5, 10],

    animators: {

        size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 },
      },
  });

  const electric = Particles.registerParticleType({
    texture: "electric",
    render: 0,
    size: [0.1, 0.2],
    lifetime: [5, 10],

    animators: {

        size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 },
      },
  });


  enum EParticles {
    GLOWWORM = glowworm,
    FLAME_WHITE = flame_white,
    STAR = star,
    SMOKE = smoke,
    VANILLA_RAIN = vanilla_rain,
    CAULDRON_BUBBLE = cauldron_bubble,
    CAULDRON_SMOKE = null,
    ELECTRIC = electric
  }
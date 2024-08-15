const glowwormColors = [
  [255, 255, 0], //yellow
  [185, 210, 255], //light blue
  [255, 165, 0], //golden  <- yellow  & [255, 185, 0]
  [0, 255, 70], //green
  [255, 0, 0], //red
  [0,  109, 56] //dark_green
].map((v) =>
  Particles.registerParticleType({
    texture: "part_color",
    render: 2,
    color: v.map((v) => v / 256).concat(1) as number3 & [number],
    size: [1, 3],
    lifetime: [40, 100],
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  })
);

const flame_white = Particles.registerParticleType({
  texture: "flame",
  render: 2,
  color: [0/256,  109/256, 56/256, 1],
  size: [6, 9],
  lifetime: [30, 40],

  animators: {
    alpha: { fadeIn: 0.4, fadeOut: 0.4 },
    size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
  },
});

const star = Particles.registerParticleType({
  texture: "flame",
  render: 0,
  size: [8, 9],
  lifetime: [80, 100],

  animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
    size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
  },
});

const smoke = Particles.registerParticleType({
  texture: "smoke",
  render: 1,
  size: [0.5, 1],
  lifetime: [80, 100],

  animators: {
    //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
    size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
  },
});

const vanilla_rain = Particles.registerParticleType({
  texture: "weather",
  render: 2,
  size: [3, 4],
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

const snowfall = Particles.registerParticleType({
  texture: "snowfall",
  render: 1,
  size: [0.5, 1],
  lifetime: [120, 180],

  animators: {
    alpha: {
      start: 0.5,
      fadeIn: 1,
      fadeOut: 0.5,
      end: 0.1,
    },
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

const poison = Particles.registerParticleType({
  texture: "poison",
  render: 0,
  size: [0.1, 0.2],
  lifetime: [5, 10],

  animators: {
    size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 },
  },
});

const insight_view = Particles.registerParticleType({
  texture: "insight_view",
  render: 2,
  size: [0.15, 0.2],
  lifetime: [5, 10],

  animators: {
    size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 },
  },
});


enum EForestParticle {
  GLOWWORM_1 = glowwormColors[0],
  GLOWWORM_2 = glowwormColors[1],
  GLOWWORM_3 = glowwormColors[2],
  GLOWWORM_4 = glowwormColors[3],
  GLOWWORM_5 = glowwormColors[4],

  FLAME_WHITE = flame_white,
  STAR = star,
  SMOKE = smoke,
  VANILLA_RAIN = vanilla_rain,
  CAULDRON_BUBBLE = cauldron_bubble,
  CAULDRON_SMOKE = null,
  ELECTRIC = electric,
  POISON = poison,
  SNOWFALL = snowfall,
  INSIGHT_VIEW = insight_view
}

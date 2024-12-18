IMPORT("BlockEngine");
IMPORT("ConnectedTexture");
IMPORT("ItemAnimHelper");
IMPORT("SoundLib");
IMPORT("EnergyNet");

declare namespace com.zhekasmirnov.innercore.api.NativeAPI {
  export function getDifficulty(): EGameDifficulty;

  export function setDifficulty(difficulty: EGameDifficulty);

  export function resetCloudColor(): void;

  export function resetFogColor(): void;

  export function resetFogDistance(): void;

  export function resetSkyColor(): void;

  export function resetSunsetColor(): void;

  export function resetUnderwaterFogColor(): void;

  export function resetUnderwaterFogDistance(): void;

  export function setFogColor(r: number, g: number, b: number): void;

  export function setSkyColor(r: number, g: number, b: number): void;

  export function setSunsetColor(r: number, g: number, b: number): void;

  export function setUnderwaterFogColor(r: number, g: number, b: number): void;

  export function setUnderwaterFogDistance(
    r: number,
    g: number,
    b: number
  ): void;

  export function setFogDistance(r: number, g: number, b: number): void;

  export function setCloudColor(r: number, g: number, b: number): void;
}

const NativeAPI = com.zhekasmirnov.innercore.api.NativeAPI;

interface RGB {
  r: number,
  g: number,
  b: number,
  alpha?: number 
};

namespace ForestUtils {
  export function setEmptyBlockCollision(id: number) {
    const render = new ICRender.Model();
    const model = BlockRenderer.createModel();
    const shape = new ICRender.CollisionShape();
    const entry = shape.addEntry();

    entry.addBox(0, 0, 0, 0, 0, 0);
    BlockRenderer.setCustomCollisionShape(id, -1, shape);
    render.addEntry(model);
  };

  export function getBiomeState(x: number, z: number, region: BlockSource): EBiomeState {
    const biome = AbstractBiome.getFor(region.getBiome(x, z));
    return biome && biome.getBiomeState ? biome.getBiomeState() : EBiomeState.BALANCE  
  }
}

type JSONLang = {
  en: string,
  ru: string
};

const recipesToInitList: Map<[id: number, count: number], ItemInstance[]> = new Map()

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
    color: v.map((v) => v / 256).concat(1) as [number, number, number, number],
    size: [1, 3],
    lifetime: [40, 100],
    animators: {
      alpha: { fadeIn: 0.4, fadeOut: 0.4 },
      size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 },
    },
  })
);

const randomGlowworm = randomInt.bind({}, 0, glowwormColors.length);

const cloud = Particles.registerParticleType({
  texture: "flame",
  render: 2,
  color: [125/256,  125/256, 125/256, 1],
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

  CLOUD = cloud,
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

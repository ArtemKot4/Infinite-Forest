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

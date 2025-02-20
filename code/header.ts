IMPORT("BlockEngine");
IMPORT("ConnectedTexture");
IMPORT("ItemAnimHelper");
IMPORT("SoundLib");
IMPORT("EnergyNet");
IMPORT("RenderUtil");
IMPORT("ICHelper");
IMPORT("CommandHelper");

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

    export function setUnderwaterFogDistance(r: number, g: number, b: number): void;

    export function setFogDistance(r: number, g: number, b: number): void;

    export function setCloudColor(r: number, g: number, b: number): void;
};

const NativeAPI = com.zhekasmirnov.innercore.api.NativeAPI;
const TextureSource = UI.TextureSource;

const NetworkEvent = BlockEngine.Decorators.NetworkEvent;
const ContainerEvent = BlockEngine.Decorators.ContainerEvent;
const ClientSide = BlockEngine.Decorators.ClientSide;

interface RGB {
    r: number;
    g: number;
    b: number;
    alpha?: number;
};

namespace Utils {
    export function getBiomeState(x: number, z: number, region: BlockSource): EBiomeState {
        const biome = AbstractBiome.getFor(region.getBiome(x, z));
        return biome && biome.getBiomeState ? biome.getBiomeState() : EBiomeState.BALANCE;
    };
};

type JSONLang = {
    en: string;
    ru: string;
};

const initRecipes: Map<[id: number, count: number], ItemInstance[]> = new Map();

namespace ForestGenerator {
    export const structurePool = new StructurePool("infinite_forest_structure_pool");
};

namespace ConfigManager {
    export const EFFECT_SCALE_IN_CREATIVE = __config__.getBool("effect_scale_in_creative");
    export const LEGACY_SKY_COLOR = __config__.getBool("legacy_sky_color");
    export const FIREFLIES_COUNT_AROUND = __config__.getInteger("fireflies_count_around") || 7;
};

namespace ToolAPI {
    export function isAxe(id: number): boolean {
        return ToolAPI.getToolData(id)?.blockMaterials?.["wood"]
    };
};

type NativeRendererTransform = com.zhekasmirnov.innercore.api.NativeRenderer.Transform;

Callback.addCallback("ItemUse", (c, i, block, isE, player) => {
    Entity.getSneaking(player) && Game.message(IDRegistry.getNameByID(block.id) + " | " + block.data)
}); //todo: debug
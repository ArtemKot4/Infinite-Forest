IMPORT("ConnectedTexture");
IMPORT("ItemAnimHelper");
IMPORT("SoundLib");
IMPORT("EnergyNet");
IMPORT("RenderUtil");
IMPORT("EffectBar");
IMPORT("Notification");
IMPORT("Command");

const NativeAPI = com.zhekasmirnov.innercore.api.NativeAPI;
const TextureSource = UI.TextureSource;

interface RGB {
    r: number;
    g: number;
    b: number;
    alpha?: number;
}

namespace Utils {
    export function getBiomeState(x: number, z: number, region: BlockSource): EBiomeState {
        const biome = AbstractBiome.getFor(region.getBiome(x, z));
        return biome && biome.getBiomeState ? biome.getBiomeState() : EBiomeState.BALANCE;
    }
}

const initRecipes: Map<[id: number, count: number], ItemInstance[]> = new Map();

namespace ForestGenerator {
    export const structurePool = new StructurePool("infinite_forest_structure_pool");
}

namespace ConfigManager {
    export const EFFECT_SCALE_IN_CREATIVE = __config__.getBool("effect_scale_in_creative");
    export const LEGACY_SKY_COLOR = __config__.getBool("legacy_sky_color");
    export const FIREFLIES_COUNT_AROUND = __config__.getInteger("fireflies_count_around") || 7;
}

Callback.addCallback("ItemUse", (c, i, block, isE, player) => {
    Entity.getSneaking(player) && Game.message(IDRegistry.getNameByID(block.id) + " | " + block.data)
}); //todo: debug

const modelsdir = __dir__ + "/resources/assets/models/";
const NativeBlock = com.zhekasmirnov.innercore.api.NativeBlock;
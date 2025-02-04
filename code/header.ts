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

    export function setUnderwaterFogDistance(r: number, g: number, b: number): void;

    export function setFogDistance(r: number, g: number, b: number): void;

    export function setCloudColor(r: number, g: number, b: number): void;
}

const NativeAPI = com.zhekasmirnov.innercore.api.NativeAPI;

const NetworkEvent = BlockEngine.Decorators.NetworkEvent;
const ContainerEvent = BlockEngine.Decorators.ContainerEvent;
const ClientSide = BlockEngine.Decorators.ClientSide;

interface RGB {
    r: number;
    g: number;
    b: number;
    alpha?: number;
}

namespace Utils {
    export function setEmptyBlockCollision(id: number) {
        const render = new ICRender.Model();
        const model = BlockRenderer.createModel();
        const shape = new ICRender.CollisionShape();
        const entry = shape.addEntry();

        entry.addBox(0, 0, 0, 0, 0, 0);
        BlockRenderer.setCustomCollisionShape(id, -1, shape);
        render.addEntry(model);
    }

    export function getBiomeState(x: number, z: number, region: BlockSource): EBiomeState {
        const biome = AbstractBiome.getFor(region.getBiome(x, z));
        return biome && biome.getBiomeState ? biome.getBiomeState() : EBiomeState.BALANCE;
    }

    export function getBlockTags(id: number): string[] {
        return TagRegistry.getTagsFor("blocks", id);
    }

    export function getItemTags(id: number): string[] {
        return TagRegistry.getTagsFor("items", id);
    };

    export function getDimensionTags(id: number): string[] {
        return TagRegistry.getTagsFor("dimensions", id);
    };

    export function actionbarMessage(player: number, message: string): void {
        Commands.exec("/title " + Entity.getNameTag(player) + " actionbar " + message);
    };

    export function isCreativePlayer(player: number) {
        const gamemode = new PlayerActor(player).getGameMode();
        
        return gamemode === EGameMode.CREATIVE || gamemode === EGameMode.SPECTATOR;
    };
};

type JSONLang = {
    en: string;
    ru: string;
};

const initRecipes: Map<[id: number, count: number], ItemInstance[]> = new Map();

namespace UIHelper {
    export function separateText(text: string, each_chars: number = 25) {
        let result = [];
        let line = "";
    
        for (let word of text.split(" ")) {
            if (line.length + word.length <= each_chars) {
                line += word + " ";
            } else {
                result.push(line.trim());
                line = word + " ";
            }
        }
    
        if (line) {
            result.push(line.trim());
        }
    
        return result.join("\n");
    };
}

Network.addClientPacket("packet.infinite_forest.send_particle", (data: IParticleSender) => {
    Particles.addParticle(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz);
})
  


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
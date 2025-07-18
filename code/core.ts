enum EBiomeState {
    BALANCE,
    COLD,
    FIRE
}

namespace EBiomeState {
    export function is(x: number, z: number, region: BlockSource): EBiomeState {
        const biome = AbstractForestBiome.getFor(region.getBiome(x, z));
        return biome && biome.getBiomeState ? biome.getBiomeState() : EBiomeState.BALANCE;
    }
}


type PartialItemInstance = Partial<ItemInstance>;

type CraftField = {
    slot_1?: PartialItemInstance;
    slot_2?: PartialItemInstance;
    slot_3?: PartialItemInstance;
    slot_4?: PartialItemInstance;
    slot_5?: PartialItemInstance;
    slot_6?: PartialItemInstance;
    slot_7?: PartialItemInstance;
    slot_8?: PartialItemInstance;
    slot_9?: PartialItemInstance;
};

const RuntimeException = java.lang.RuntimeException;
const NullPointerException = java.lang.NullPointerException;
const IllegalArgumentException = java.lang.IllegalArgumentException;
const NoSuchFieldException = java.lang.NoSuchFieldException;

const structureDIR = __dir__ + "resources/assets/structures/";
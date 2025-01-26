function range(min: number, max: number): number[] {
    const list = [];

    for (let i = min; i < max; i++) {
        list.push(i);
    }

    return list;
}

function parseBlockID(id: string): number {
    return BlockID[id] || VanillaBlockID[id];
}

function parseItemID(id: string): number {
    return ItemID[id] || VanillaItemID[id];
}

function parseID(id: string): number {
    return parseBlockID(id) ?? parseItemID(id);
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const enum EBiomeState {
    BALANCE,
    COLD,
    FIRE,
};

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

namespace MathHelper {
    export function randomFrom<T>(...elements: T[]) {
        return elements[Math.floor(Math.random() * elements.length)];
    };

    export function randomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    };
}

const structureDIR = __dir__ + "resources/assets/structures/";
function range(min: number, max: number): number[] {
    const list = [];

    for(let i = min; i < max; i++) {
        list.push(i);
    };

    return list;
};

function parseBlockID(id: string): number {
    return BlockID[id] || VanillaBlockID[id];
};

function parseItemID(id: string): number {
    return ItemID[id] || VanillaItemID[id];
};

function parseID(id: string): number {
    return parseBlockID(id) ?? parseItemID(id);
}

const enum EBiomeState {
    BALANCE,
    COLD,
    FIRE
};


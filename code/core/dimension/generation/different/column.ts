namespace ForestGenerator {
    export function placeColumn(block: Tile, coords: Vector, height: number, width?: number, region = World) {
        if (width) {
            for (let x = -coords.x - width; x < coords.x + width; x++) {
                for (let z = -coords.z - width; z < coords.z + width; z++) {
                    for (let y = coords.y + 1; y < coords.y + height; y++) {
                        region.setBlock(x, y, z, block.id, block.data);
                    }
                }
            }
            return;
        }
        for (let y = coords.y + 1; y < coords.y + height; y++) {
            region.setBlock(coords.x, y, coords.z, block.id, block.data);
        }
        return;
    };
}
interface BiomeBehaviour {
    onChunkGenerated?(coordsX: number, coordsZ: number, x: number, y: number, z: number, surface: Tile): void;
    onTick?(player: number, region: BlockSource, x: number, y: number, z: number): void
};

interface BiomeBehaviour {
    onChunkGenerated?(coordsX: number, coordsZ: number, x: number, y: number, z: number, surface: Tile): void;
    /**
     * 
     * @param player player in a current tick 
     * @param region region in a current tick
     * @param x position of player in a current tick with x 
     * @param y position of player in a current tick with y 
     * @param z position of player in a current tick with z 
     */
    insideServerTick?(player: number, region: BlockSource, x: number, y: number, z: number, time: number): void
    insideLocalTick?(position: Vector, time: number): void

    getLocalUpdate?(): number;
    getServerUpdate?(): number;
};

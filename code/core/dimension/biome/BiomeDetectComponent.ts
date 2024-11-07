interface BiomeDetectComponent {
    onBiomeDetected?(coordsX: number, coordsZ: number, x: number, y: number, z: number, surface: Tile): void;
};

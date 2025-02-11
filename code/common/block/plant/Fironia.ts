class Fironia extends BlockPlant {
    constructor() {
        super("fironia", [{
            "name": "block.infinite_forest.fironia",
            "texture": [["fironia", 0]],
            "inCreative": true
        }]);
    };

    public getLightLevel(): number {
        return 8;
    };

    public getBiomeState(): EBiomeState {
        return EBiomeState.BALANCE;
    };

    public spawnFlame(x: number, y: number, z: number) {
        Particles.addParticle(
            EParticleType.FLAME,
            x + 0.45 + Math.random() / 10,
            y + 0.75 + Math.random() / 10,
            z + 0.45 + Math.random() / 10,
            0,
            0,
            0,
            1
        );
    };

    public onAnimateTick(x: number, y: number, z: number, id: number, data: number): void {
        this.spawnFlame(x, y, z);
    };

    public onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
        super.onNeighbourChange(coords, block, changeCoords, region);
        
        this.spawnFlame(coords.x, coords.y, coords.z);
        this.spawnFlame(changeCoords.x, changeCoords.y, changeCoords.z);
    }
};
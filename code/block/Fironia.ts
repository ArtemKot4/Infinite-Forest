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
            x + 0.5,
            y + 0.5, 
            z + 0.5, 
            Math.random(), 
            Math.random(), 
            Math.random()
        );
    };

    public onAnimateTick(x: number, y: number, z: number, id: number, data: number): void {
        this.spawnFlame(x, y, z);
    };

    public onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
        this.spawnFlame(coords.x, coords.y, coords.z);
        this.spawnFlame(changeCoords.x, changeCoords.y, changeCoords.z);
    }
};
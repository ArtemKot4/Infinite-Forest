class FirefliesForest extends AbstractBiome implements BiomeBehaviour {
    public constructor() {
        super("fireflies_forest");
    }

    public override getBiomeState(): EBiomeState {
        return EBiomeState.BALANCE;
    }

    public override getPlantList() {
        return {
            tallgrass: { 
                rarity: 0.99,
                count: 32
            },
            double_plant: { 
                rarity: 0.4, 
                count: 3 
            },
            yellow_flower: { 
                rarity: 0.2, 
                count: 5 
            },
            red_flower: { 
                rarity: 0.5, 
                count: 4 
            },
            fironia: { 
                rarity: 0.1, 
                count: 3 
            },
            electric_mushroom: { 
                rarity: 0.03, 
                count: 3, 
                tile: true 
            },
            brown_mushroom: { 
                rarity: 0.01, 
                count: 3 
            },
            red_mushroom: { 
                rarity: 0.01,
                count: 3 
            }
        };
    }

    public override getStructures(): { name: string; chance: number; count: number; }[] {
        return [
            {
                name: "eucalyptus_tree_0",
                chance: 0.89,
                count: 3
            },
            {
                name: "pink_tree_0",
                chance: 0.78,
                count: 2
            },
            {
                name: "eucalyptus_tree_0",
                chance: 0.64,
                count: 3
            },
            {
                name: "pink_tree_0",
                chance: 0.64,
                count: 2
            },
            {
                name: "electric_mushroom_tree_0",
                chance: 0.01,
                count: 1
            },
            {
                name: "electric_mushroom_tree_1",
                chance: 0.004,
                count: 1
            },
            {
                name: "big_mushroom_tree",
                chance: 0.004,
                count: 1
            },
            {
                name: "brown_mushroom_tree_0",
                chance: 0.01,
                count: 1
            },
            {
                name: "brown_mushroom_tree_1",
                chance: 0.008,
                count: 1
            },
            {
                name: "red_mushroom_tree",
                chance: 0.01,
                count: 1
            }
        ];
    }

    public insideLocalTick(position: Vector, time: number): void {
        if(position.y >= 300) {
            return;
        }

        if(time % 15 === 0 && position.y <= 100) {
            ParticleHelper.spawnFire(position);
        }

        if(position.y < 110) {
            for(let i = 0; i < ConfigManager.FIREFLIES_COUNT_AROUND; i++) {
                ParticleHelper.spawnGlowworm(position, ParticleHelper.getRandomGlowworm());
            }
        }
    }

    public getLocalUpdate(): number {
        return 5;
    }
}
class FirefliesForest extends AbstractBiome implements BiomeBehaviour {
    public constructor() {
        super("fireflies_forest");
    }

    public override getBiomeState(): EBiomeState {
        return EBiomeState.BALANCE;
    }

    public override getPlantList() {
        return {
            tallgrass: { rarity: 0.99, count: 32 },
            double_plant: { rarity: 0.4, count: 3 },
            //tallgrass: {rarity: 0.8, data: 2, count: 8},
            yellow_flower: { rarity: 0.2, count: 5 },
            red_flower: { rarity: 0.5, count: 4 },
            fironia: { rarity: 0.1, count: 3 },
            ice_flower: { rarity: 0.1, count: 3 },
            electric_mushroom: { rarity: 0.05, count: 3 }
        };
    };

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
    };

    public onLocalTick(position: Vector, time: number): void {
        if(position.y >= 300) {
            return;
        };

        if(time % 15 === 0 && position.y <= 100) {
            addFire(position);
        };

        if(position.y < 110) {
            addGlowworm(position, MathHelper.randomFromArray(glowwormColors));
            addGlowworm(position, MathHelper.randomFromArray(glowwormColors));
            addGlowworm(position, MathHelper.randomFromArray(glowwormColors));
        };
        
    };

    public getLocalUpdate(): number {
        return 5;
    };
};
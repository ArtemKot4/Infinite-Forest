class Planks extends BlockForest {
    constructor(id: string, public log_id: string, public bark_id: string, public hewn_id: string) {
        super(id, [{
            name: "block.infinite_forest." + id,
            inCreative: true,
            texture: [[id, 0]]
        }]);
    };

    public build(): void {
        super.build();
        
        initRecipes.set([this.id, 4], [
            new ItemStack(BlockID[this.log_id], 1, 0)
        ]);

        initRecipes.set([this.id, 4], [
            new ItemStack(BlockID[this.bark_id], 1, 0)
        ]);

        initRecipes.set([this.id, 4], [
            new ItemStack(BlockID[this.hewn_id], 1, 0)
        ]);
    }
}
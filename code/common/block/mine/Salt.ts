class Salt extends BlockForest {
    constructor() {
        super("salt", [{
                name: "block.infinite_forest.salt",
                texture: [["salt", 0]],
                inCreative: true
        }]);
    };

    public getDestroyLevel(): MiningLevel {
        return MiningLevel.STONE;
    };
};
class Fironia extends BlockPlant {
    constructor() {
        super("fironia", [{
            "name": "block.infinite_forest.fironia",
            "texture": [["fironia", 0]],
            "inCreative": true
        }]);
    };

    public getLightLevel(): number {
        return 6;
    };
};
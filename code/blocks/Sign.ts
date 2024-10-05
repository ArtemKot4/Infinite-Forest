namespace Sign {

   export const list: string[] = [
        "crystal", "snow", "fire", "forest", "question"
    ];

   export const block = (() => {
        const content: Block.BlockVariation[] = new Array().fill(1, 0, list.length)
        .map((v, i, a) => {
            return {"name": "block.infinite_forest.sign",
             "texture": [[(["unknown"].concat(list))[i], 0]], "inCreative": true}
        });
        
        const block = new DungeonBlock("stone_sign", content, "stone");
        block.create();
        return block;
    }) ();

};

Translation.addTranslation("block.infinite_forest.sign", {
    en: "Stone sign",
    ru: "Каменный знак"
})
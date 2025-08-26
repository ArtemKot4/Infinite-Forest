namespace SignList {
    export const SNOW = new Sign("snow", "environment/sign/snow.png");
    export const FIRE = new Sign("fire", "environment/sign/fire.png");
    export const FOREST = new Sign("forest", "environment/sign/forest.png");
    export const QUESTION = new Sign("question", "environment/sign/question.png");
    export const CRYSTAL = new Sign("crystal", "environment/sign/crystal.png");

    FIRE.addKeywords(
        "coal", 
        "torch", 
        "lamp", 
        "wood", 
        "fironia",
        "generator",
        "stick",
        "candle",
        "furnace",
        "spark",
        "fire"
    );
    SNOW.addKeywords(
        "snow",
        "ice"
    );
    CRYSTAL.addKeywords(
        "crystal",
        "quartz",
        "diamond",
        "glass"
    );
    FOREST.addKeywords(
        "plant",
        "flower",
        "grass",
        "seed",
        "pumpkin",
        "melon",
        "water",
        "wheat",
        "campfire",
        "dirt",
        "fironia",
        "stick",
        "sapling",
        "crafting_table",
        "oak",
        "log",
        "planks",
        "hewn",
        "bark",
        "mushroom",
        "root"
    );
}
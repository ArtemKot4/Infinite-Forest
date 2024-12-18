Callback.addCallback("ItemUse", (coords, item, block, isE, player) => {
    if(Entity.getSneaking(player)) {
        Game.message(JSON.stringify(Flags.getFor(player).book));
    };
});

Callback.addCallback("LevelDisplayed", () => {
    BookPage.loadFromJSON(__dir__ + "resources/assets/pages/");
    Game.message(JSON.stringify(BookPage.list["default"])) //todo: debug;

    for(const recipe of recipesToInitList.entries()) {
        Recipes.addShapeless(new ItemStack(recipe[0][0], recipe[0][1]), recipe[1]);
    };
    
})
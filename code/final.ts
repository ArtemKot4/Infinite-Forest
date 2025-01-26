Callback.addCallback("ItemUse", (coords, item, block, isE, player) => {
    if(Entity.getSneaking(player)) {
    };
});

Callback.addCallback("LevelDisplayed", () => {
    BookPage.loadFromJSON(__dir__ + "resources/assets/pages/");
    Game.message(JSON.stringify(BookPage.list["default"])) //todo: debug;

    for(const recipe of initRecipes.entries()) {
        Recipes.addShapeless(new ItemStack(recipe[0][0], recipe[0][1]), recipe[1]);
    };
    
})
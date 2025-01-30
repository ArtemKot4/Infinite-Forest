Callback.addCallback("LevelDisplayed", () => {    
    Recipes.addShapeless(new ItemStack(VanillaItemID.bread, 1), [
        new ItemStack(ItemList.WHEAT_FLOUR.id, 1)
    ]);

    BlockList.WINDMILL_STATION.factory.addRecipe(ItemList.WHEAT_FLOUR.id, 296);

    for(const recipe of initRecipes.entries()) {
        Recipes.addShapeless(new ItemStack(recipe[0][0], recipe[0][1]), recipe[1]);
    };
});
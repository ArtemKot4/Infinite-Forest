Callback.addCallback("LevelDisplayed", () => {    
    Recipes.addShapeless(new ItemStack(VanillaItemID.bread, 1), [
        new ItemStack(ItemList.WHEAT_FLOUR.id, 1)
    ]);

    WindmillStation.factory.registerRecipe(new ItemStack(ItemList.WHEAT_FLOUR.id), [new ItemStack(296)]);

    for(const recipe of initRecipes.entries()) {
        Recipes.addShapeless(new ItemStack(recipe[0][0], recipe[0][1]), recipe[1]);
    }

    Recipes.addShaped({ id: BlockList.BOTTLE.id, count: 1, data: 0 }, [
        "aba",
        "a a",
        "aaa"
    ], ['a', VanillaBlockID.glass, 0, 'b', BlockList.EUCALYPTUS_LOG.id, 0]);

    Recipes.addShaped({ id: BlockList.WINDMILL_STATION.id, count: 1, data: 0, }, [
        "aba",
        "bcb",
        "aba"
    ], ['a', VanillaBlockID.cobblestone, 0, 'b', BlockList.EUCALYPTUS_LOG.id, 0, 'c', VanillaBlockID.smooth_stone, 0]);

    Recipes.addShaped({ id: BlockList.WINDMILL_BLADES.id, count: 1, data: 0 }, [
        " a ",
        "aba",
        " a"
    ], ['a', BlockList.EUCALYPTUS_PLANKS.id, 0, 'b', BlockList.EUCALYPTUS_LOG.id, 0]);

    const extra = new ItemExtraData();
    extra.putString("text", "edit");

    Recipes.addShapeless({ id: ItemList.ANCIENT_NOTE.id, count: 1, data: 0, extra: extra },
        [{
            id: VanillaItemID.paper,
            data: 0
        }, {
            id: VanillaItemID.coal,
            data: 0
        }]
    );

    
    Recipes.addShapeless({ id: ItemList.ANCIENT_NOTE.id, count: 1, data: 0, extra: extra },
        [{
            id: VanillaItemID.paper,
            data: 0
        }, {
            id: VanillaItemID.charcoal,
            data: 0
        }]
    );
});
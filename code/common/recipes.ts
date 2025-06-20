Callback.addCallback("LevelDisplayed", () => {    
    Recipes.addShapeless(new ItemStack(VanillaItemID.bread, 1, 0), [
        new ItemStack(ItemList.WHEAT_FLOUR.id, 1, 0)
    ]);

    Recipes.addShapeless(new ItemStack(ItemList.FOREST_MAP.id, 1, 0), [
        new ItemStack(VanillaItemID.paper, 4, 0),
        new ItemStack(ItemList.SPARKLING_GRASSES.id, 1, 0)
    ]);

    Recipes.addShaped(new ItemStack(263, 1, 0), [
        "",
        " ab",
        ""
    ], ['a', ItemList.FOREST_MAP.id, 0, 'b', ItemList.SPARKLING_GRASSES.id, 0], function onCraft(api, field) {
        const mapSlot = api.getFieldSlot(4);
        const grassSlot = api.getFieldSlot(5);
        alert(IDRegistry.getNameByID(mapSlot.id));
        const mapExtra = mapSlot.extra || new ItemExtraData();
        mapExtra.putInt("distance", mapExtra.getInt("distance", 128) * 2);
        mapSlot.set(mapSlot.id, mapSlot.count, mapSlot.data, mapExtra);
        grassSlot.set(grassSlot.id, grassSlot.count-1, grassSlot.data);
    });
    Recipes.addFurnaceFuel(ItemList.SPARKLING_GRASSES.id, 0, 100);

    WindmillStation.factory.registerRecipe({ id: ItemList.WHEAT_FLOUR.id, count: 1, data: 0 }, [{
        id: 296,
        count: 1,
        data: 0  
    }]);

    WindmillStation.factory.registerRecipe({ id: ItemList.SPARKLING_GRASSES.id, count: 1, data: 0 }, [{
        id: BlockList.SPARKLING_ROOTS.id,
        count: 1,
        data: 0
    }]);

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

    Recipes.addShapeless({ id: ItemList.ANCIENT_NOTE.id, count: 1, data: 0, extra: extra }, [
        {
            id: VanillaItemID.paper,
            data: 0
        }, {
            id: VanillaItemID.coal,
            data: 0
        }
    ]);

    
    Recipes.addShapeless({ id: ItemList.ANCIENT_NOTE.id, count: 1, data: 0, extra: extra }, [
        {
            id: VanillaItemID.paper,
            data: 0
        }, {
            id: VanillaItemID.charcoal,
            data: 0
        }
    ]);
});
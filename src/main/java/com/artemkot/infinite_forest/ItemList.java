package com.artemkot.infinite_forest;

import com.artemkot.infinite_forest.items.TransferCrystal;

import net.neoforged.neoforge.registries.DeferredItem;

public class ItemList {
    public static final DeferredItem<TransferCrystal> ICE_CRYSTAL = InfiniteForest.ITEMS.register("ice_crystal", () -> new TransferCrystal(0));
    public static final DeferredItem<TransferCrystal> FIRE_CRYSTAL = InfiniteForest.ITEMS.register("fire_crystal", () -> new TransferCrystal(1));

    public static void register() {}
}

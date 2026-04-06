package com.artemkot.infinite_forest.common.item.ancient_note;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.common.item.TransferCrystal;

import net.minecraft.world.level.Level;
import net.neoforged.neoforge.registries.DeferredItem;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ItemList {
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(InfiniteForest.MOD_ID);

    public static final DeferredItem<TransferCrystal> ICE_CRYSTAL = 
        ITEMS.register("ice_crystal", () -> new TransferCrystal(com.artemkot.infinite_forest.common.world.InfiniteForestDimension.FOREST_DIMENSION));

    public static final DeferredItem<TransferCrystal> FIRE_CRYSTAL = 
        ITEMS.register("fire_crystal", () -> new TransferCrystal(Level.OVERWORLD));

    public static final DeferredItem<AncientNote> ANCIENT_NOTE = ITEMS.register("ancient_note", AncientNote::new);

    public static final DeferredItem<?> WHEAT_FLOUR = ITEMS.registerSimpleItem("wheat_flour");
}

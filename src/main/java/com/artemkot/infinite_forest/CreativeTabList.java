package com.artemkot.infinite_forest;

import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.ItemStack;
import net.neoforged.neoforge.registries.DeferredRegister;

import java.util.function.Supplier;

import com.artemkot.infinite_forest.items.ItemList;

public class CreativeTabList {
     public static final DeferredRegister<CreativeModeTab> TABS = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, InfiniteForest.MOD_ID);

    public static final Supplier<CreativeModeTab> INFINITE_FOREST_TAB = 
        TABS.register("nature", 
            () -> CreativeModeTab.builder()
                .title(Component.translatable("creative_tab.infinite_forest.nature"))
                .icon(() -> new ItemStack(ItemList.ICE_CRYSTAL.get()))
                .displayItems((parameters, output) -> {
                    output.accept(ItemList.ICE_CRYSTAL.get());
                    output.accept(ItemList.FIRE_CRYSTAL.get());
                    output.accept(ItemList.ANCIENT_NOTE.get());
                })
                .build()
        );

    public static final Supplier<CreativeModeTab> INVENTIONS_TAB = 
        TABS.register("inventions", 
            () -> CreativeModeTab.builder()
                .title(Component.translatable("creative_tab.infinite_forest.inventions"))
                .icon(() -> new ItemStack(ItemList.WHEAT_FLOUR.get()))
                .displayItems((parameters, output) -> {
                    output.accept(ItemList.WHEAT_FLOUR.get());
                })
                .build()
        );
    
    public static void init() {}
}

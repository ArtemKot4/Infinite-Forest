package com.artemkot.infinite_forest;

import net.minecraft.network.chat.Component;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.ItemStack;

import java.util.function.Supplier;

public class CreativeTabList {
    public static final Supplier<CreativeModeTab> INFINITE_FOREST_TAB = 
        InfiniteForest.CREATIVE_MODE_TABS.register("infinite_forest_tab", 
            () -> CreativeModeTab.builder()
                .title(Component.translatable("creativetab.infinite_forest.infinite_forest_tab"))
                .icon(() -> new ItemStack(ItemList.ICE_CRYSTAL.get()))
                .displayItems((parameters, output) -> {
                    output.accept(ItemList.ICE_CRYSTAL.get());
                    output.accept(ItemList.FIRE_CRYSTAL.get());
                })
                .build()
        );
    
    public static void register() {}
}

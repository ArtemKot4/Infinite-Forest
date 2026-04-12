package com.artemkot.infinite_forest.common;

import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.ItemStack;
import net.neoforged.neoforge.registries.DeferredRegister;

import java.util.function.Supplier;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.common.block.BlockList;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNoteStorage;
import com.artemkot.infinite_forest.common.item.ancient_note.ItemList;
import com.artemkot.infinite_forest.common.item.data_components.AncientNoteData;
import com.artemkot.infinite_forest.Config;

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
                    
                    output.accept(BlockList.FIRE_FLOWER.get());
                    output.accept(BlockList.MOON_FLOWER.get());
                    
                    AncientNoteStorage.container.forEach((stringId, page) -> {
                        if(Config.DEVELOPMENT_MODE.get() == true) {
                            ItemStack stack = ItemList.ANCIENT_NOTE.toStack();
                            stack.set(DataComponentList.ANCIENT_NOTE_DATA.get(), new AncientNoteData(stringId));
                            output.accept(stack);
                        }
                    });
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
}

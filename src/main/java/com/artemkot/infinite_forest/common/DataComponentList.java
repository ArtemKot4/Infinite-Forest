package com.artemkot.infinite_forest.common;

import com.artemkot.infinite_forest.common.item.data_components.AncientNotePage;

import net.minecraft.core.component.DataComponentType;
import net.minecraft.core.registries.Registries;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;

public class DataComponentList {
    public static final DeferredRegister<DataComponentType<?>> COMPONENTS =
            DeferredRegister.create(Registries.DATA_COMPONENT_TYPE, "infinite_forest");

    public static final DeferredHolder<DataComponentType<?>, DataComponentType<AncientNotePage>> ANCIENT_NOTE_DATA = 
    COMPONENTS
        .register("ancient_note_data", () -> DataComponentType.<AncientNotePage>builder()
        .persistent(AncientNotePage.CODEC)
        .networkSynchronized(AncientNotePage.STREAM_CODEC)
        .build());
}

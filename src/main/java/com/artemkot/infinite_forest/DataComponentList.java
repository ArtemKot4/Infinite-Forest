package com.artemkot.infinite_forest;

import com.artemkot.infinite_forest.items.data_components.AncientNoteData;

import net.minecraft.core.component.DataComponentType;
import net.minecraft.core.registries.Registries;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;

public class DataComponentList {
    public static final DeferredRegister<DataComponentType<?>> COMPONENTS =
            DeferredRegister.create(Registries.DATA_COMPONENT_TYPE, "infinite_forest");

    public static final DeferredHolder<DataComponentType<?>, DataComponentType<AncientNoteData>> ANCIENT_NOTE_DATA = 
    COMPONENTS
        .register("ancient_note_data", () -> DataComponentType.<AncientNoteData>builder()
        .persistent(AncientNoteData.CODEC)
        .networkSynchronized(AncientNoteData.STREAM_CODEC)
        .build());
}

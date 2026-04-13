package com.artemkot.infinite_forest;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.effect.PlayerEffectStorage;

import net.neoforged.neoforge.attachment.AttachmentType;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

import java.util.function.Supplier;

public class AttachmentList {
    public static final DeferredRegister<AttachmentType<?>> ATTACHMENTS =
        DeferredRegister.create(NeoForgeRegistries.ATTACHMENT_TYPES, InfiniteForest.MOD_ID);
    
    public static final Supplier<AttachmentType<PlayerEffectStorage>> PLAYER_EFFECTS =
        ATTACHMENTS.register("player_effects", () ->AttachmentType.builder(PlayerEffectStorage::new)
            //.serialize(PlayerEffectStorage.CODEC)  // чуть позже, когда будет готово
            .build()
    );
}
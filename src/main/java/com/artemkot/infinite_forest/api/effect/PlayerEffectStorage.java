package com.artemkot.infinite_forest.api.effect;

import net.neoforged.neoforge.attachment.AttachmentType;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

import java.util.ArrayList;
import java.util.List;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

public class PlayerEffectStorage {
    private final List<EffectPlayerData> activeEffects = new ArrayList<>();
    
    public List<EffectPlayerData> getActiveEffects() {
        return activeEffects;
    }
    
    public void addEffect(EffectPlayerData effect) {
        activeEffects.remove(effect);
        activeEffects.add(effect);
    }
    
    public void removeEffect(EffectPlayerData effect) {
        activeEffects.remove(effect);
    }
    
    public void clearEffects() {
        activeEffects.clear();
    }
}
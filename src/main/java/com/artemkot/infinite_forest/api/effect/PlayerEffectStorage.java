package com.artemkot.infinite_forest.api.effect;

import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.neoforged.neoforge.attachment.AttachmentType;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mojang.serialization.Codec;

import io.netty.buffer.ByteBuf;
public class PlayerEffectStorage {
    private final HashMap<String, EffectPlayerData> activeEffects = new HashMap<>();
    
    public static final Codec<PlayerEffectStorage> CODEC = 
        Codec.unboundedMap(Codec.STRING, EffectPlayerData.CODEC).xmap(
            map -> {
                PlayerEffectStorage storage = new PlayerEffectStorage();
                storage.activeEffects.putAll(map);
                return storage;
            },
            storage -> {
                return storage.activeEffects;
            }
        );

    public static final StreamCodec<ByteBuf, PlayerEffectStorage> STREAM_CODEC = 
        ByteBufCodecs.map(HashMap::new, 
            ByteBufCodecs.STRING_UTF8,
            EffectPlayerData.STREAM_CODEC
        ).map(
            map -> {
                PlayerEffectStorage storage = new PlayerEffectStorage();
                storage.activeEffects.putAll(map);
                return storage;
            },
            storage -> storage.activeEffects
        );

    public Collection<EffectPlayerData> getActiveEffects() { 
        return activeEffects.values(); 
    }
    
    public void addEffect(EffectPlayerData effect) { 
        activeEffects.put(effect.id, effect); 
    }
    
    public boolean hasEffect(String id) { 
        return activeEffects.containsKey(id); 
    }
    
    public EffectPlayerData getEffect(String id) { 
        return activeEffects.get(id); 
    }
    
    public void removeEffect(String id) { 
        activeEffects.remove(id); 
    }
    
    public void clearEffects() { 
        activeEffects.clear(); 
    }
}
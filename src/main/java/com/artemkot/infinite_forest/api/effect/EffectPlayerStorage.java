package com.artemkot.infinite_forest.api.effect;

import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.attachment.AttachmentType;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.artemkot.infinite_forest.AttachmentList;
import com.mojang.serialization.Codec;

import io.netty.buffer.ByteBuf;
public class EffectPlayerStorage {
    private final HashMap<String, EffectPlayerData> activeEffects = new HashMap<>();
    
    public static final Codec<EffectPlayerStorage> CODEC = 
        Codec.unboundedMap(Codec.STRING, EffectPlayerData.CODEC).xmap(
            map -> {
                EffectPlayerStorage storage = new EffectPlayerStorage();
                storage.activeEffects.putAll(map);
                return storage;
            },
            storage -> {
                return storage.activeEffects;
            }
        );

    public static final StreamCodec<ByteBuf, EffectPlayerStorage> STREAM_CODEC = 
        ByteBufCodecs.map(HashMap::new, 
            ByteBufCodecs.STRING_UTF8,
            EffectPlayerData.STREAM_CODEC
        ).map(
            map -> {
                EffectPlayerStorage storage = new EffectPlayerStorage();
                storage.activeEffects.putAll(map);
                return storage;
            },
            storage -> storage.activeEffects
        );

    public Collection<EffectPlayerData> getActiveEffects() { 
        return activeEffects.values(); 
    }
    
    public void addEffect(EffectPlayerData effect) { 
        if(hasEffect(effect.id)) {
            EffectPlayerData actualEffect = getEffect(effect.id);
            actualEffect.duration = effect.duration;
            actualEffect.timerMax = effect.timerMax;
            actualEffect.timer = Math.min(actualEffect.timer, effect.timerMax);
            effect = actualEffect;
        }
        activeEffects.put(effect.id, effect); 
    }
    
    public boolean hasEffect(String id) { 
        return activeEffects.containsKey(id); 
    }

    public boolean hasFullEffect(String id) { 
        return hasEffect(id) && getEffect(id).timer == getEffect(id).timerMax; 
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

    public static void addEffect(Player player, EffectPlayerData effect) { 
        if(player.isCreative() || player.isSpectator()) {
            return;
        }
        EffectPlayerStorage storageData = player.getData(AttachmentList.PLAYER_EFFECTS);
        storageData.addEffect(effect); 
        player.setData(AttachmentList.PLAYER_EFFECTS, storageData);
    }

    public static boolean hasEffect(Player player, String id) { 
        return player.getData(AttachmentList.PLAYER_EFFECTS).hasEffect(id); 
    }

    public static boolean hasFullEffect(Player player, String id) { 
        return player.getData(AttachmentList.PLAYER_EFFECTS).hasFullEffect(id); 
    }

    public static void removeEffect(Player player, String id) { 
        EffectPlayerStorage storageData = player.getData(AttachmentList.PLAYER_EFFECTS);
        storageData.removeEffect(id); 
        player.setData(AttachmentList.PLAYER_EFFECTS, storageData);
    }

    public static void clearEffects(Player player) { 
         EffectPlayerStorage storageData = player.getData(AttachmentList.PLAYER_EFFECTS);
        storageData.clearEffects(); 
        player.setData(AttachmentList.PLAYER_EFFECTS, storageData);
    }
}
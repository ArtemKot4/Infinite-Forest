package com.artemkot.infinite_forest.common.world;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.curse.CurseEvents;
import com.artemkot.infinite_forest.api.effect.EffectManager;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectTickEvents;

import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.biome.Biome;
import net.minecraft.world.level.biome.BiomeSource;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;
import net.neoforged.neoforge.registries.DeferredRegister;

public class InfiniteForestDimension {
    public static final Set<UUID> winterForestGuests = new HashSet<>();
    public static final ResourceKey<Level> FOREST_DIMENSION = 
        ResourceKey.create(
            Registries.DIMENSION,
            ModResources.getResourceLocation("infinite_forest")
        );

    public static final ResourceKey<Biome> FIREFLIES_FORES_BIOME = 
        ResourceKey.create(
            Registries.BIOME,
            ModResources.getResourceLocation("fireflies_forest")
        );

    public static final ResourceKey<Biome> WINTER_FOREST_BIOME =
        ResourceKey.create(
            Registries.BIOME,
            ModResources.getResourceLocation("winter_forest")
        );

    // public static final DeferredRegister<com.mojang.serialization.MapCodec<? extends BiomeSource>> BIOME_SOURCES =
    //     DeferredRegister.create(BuiltInRegistries.BIOME_SOURCE.key(), InfiniteForest.MOD_ID);
    
    // public static final Supplier<com.mojang.serialization.MapCodec<InfiniteForestBiomeSource>> INFINITE_FOREST =
    //     BIOME_SOURCES.register("infinite_forest", () -> InfiniteForestBiomeSource.CODEC);

    public static void onPlayerClientTick(PlayerTickEvent.Post event) {

    }

    public static void onPlayerServerTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();
        Level level = player.level();
        UUID uuid = player.getUUID();

        if(level.getGameTime() % 20 == 0) {
            ResourceKey<Biome> biome = level.getBiome(player.blockPosition()).getKey();
        
            if(biome.equals(WINTER_FOREST_BIOME)) {
                winterForestGuests.add(player.getUUID());
                EffectManager.addEffect(player, new EffectPlayerData("cold", 200, 30));
            } else {
                if(winterForestGuests.contains(uuid)) {
                    EffectManager.setDuration(player, "cold", 0);
                    winterForestGuests.remove(uuid);
                }
            }
        }

    }
} 
package com.artemkot.infinite_forest.common;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.curse.CurseEvents;
import com.artemkot.infinite_forest.api.effect.EffectTickEvents;
import com.artemkot.infinite_forest.common.world.InfiniteForestDimension;

import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.GameRules;
import net.minecraft.world.level.Level;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent.PlayerChangedDimensionEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class Events {
    @SubscribeEvent
    public static void onDimensionChange(PlayerEvent.PlayerChangedDimensionEvent event) {
        Player player = event.getEntity();
        
        if (player.level().dimension().location().equals(InfiniteForestDimension.FOREST_DIMENSION.location())) {
            if (!player.level().isClientSide()) {
                ServerLevel serverLevel = (ServerLevel) player.level();
                
               player.getServer().getCommands().performPrefixedCommand(
                    player.createCommandSourceStack(),
                    "time set night"
                );
                serverLevel.getGameRules().getRule(GameRules.RULE_DAYLIGHT).set(false, serverLevel.getServer());
                
                player.displayClientMessage(Component.literal("§6Вечная ночь окутывает лес..."), false);
            }
        }
    }

    @SubscribeEvent
    public static void onPlayerTick(PlayerTickEvent.Post event) {
        if(event.getEntity().level().isClientSide) {
            return;
        }
        CurseEvents.tick(event);
        EffectTickEvents.tick(event);
    }
}

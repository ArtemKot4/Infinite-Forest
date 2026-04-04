package com.artemkot.infinite_forest;

import com.artemkot.infinite_forest.world.InfiniteForestDimension;

import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.GameRules;
import net.minecraft.world.level.Level;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent.PlayerChangedDimensionEvent;

public class Events {
    @SubscribeEvent
    public void onDimensionChange(PlayerEvent.PlayerChangedDimensionEvent event) {
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
}

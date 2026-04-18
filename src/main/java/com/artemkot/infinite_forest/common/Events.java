package com.artemkot.infinite_forest.common;

import com.artemkot.infinite_forest.Config;
import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.curse.CurseEvents;
import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.api.effect.EffectManager;
import com.artemkot.infinite_forest.api.effect.EffectTickEvents;
import com.artemkot.infinite_forest.api.world.WorldCurseData;
import com.artemkot.infinite_forest.api.world.WorldFoundAncientNoteData;
import com.artemkot.infinite_forest.common.world.InfiniteForestDimension;
import com.artemkot.infinite_forest.common.world.ForestDataManager;
import com.artemkot.infinite_forest.common.world.curse.ColdCurse;
import com.artemkot.infinite_forest.network.packets.LogNeedForestDataPacket;
import com.artemkot.infinite_forest.network.packets.SyncCursesPacket;
import com.artemkot.infinite_forest.network.packets.SyncFoundAncientNotesPacket;

import net.minecraft.client.player.LocalPlayer;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.GameRules;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.storage.WorldData;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.ClientPlayerNetworkEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent.PlayerChangedDimensionEvent;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;
import net.neoforged.neoforge.network.PacketDistributor;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class Events {
    @SubscribeEvent
    public static void onDimensionChange(PlayerEvent.PlayerChangedDimensionEvent event) {
        Player player = event.getEntity();
        Level level = player.level();
        
        if(level.dimension().equals(InfiniteForestDimension.FOREST_DIMENSION)) {
            if(!player.level().isClientSide()) {
                ServerLevel serverLevel = (ServerLevel) player.level();
                
                player.getServer().getCommands().performPrefixedCommand(
                    player.createCommandSourceStack().withPermission(4),
                    "time set night"
                );
                serverLevel.getGameRules().getRule(GameRules.RULE_DAYLIGHT).set(false, serverLevel.getServer());
                player.displayClientMessage(Component.literal("§6Вечная ночь окутывает лес..."), false);
            }
        }
    }

    @SubscribeEvent
    public static void onPlayerTick(PlayerTickEvent.Post event) {
        CurseEvents.tick(event);
        EffectTickEvents.tick(event);
        Level level = event.getEntity().level();

        if(level.dimension().equals(InfiniteForestDimension.FOREST_DIMENSION)) {
            if(level.isClientSide()) {
                InfiniteForestDimension.onPlayerClientTick(event);
            } else {
                InfiniteForestDimension.onPlayerServerTick(event);
            }
        }
    }

    @SubscribeEvent
    public static void onLeftClickBlock(PlayerInteractEvent.LeftClickBlock event) {
        if(event.getEntity().isCreative()) {
            return;
        }
        if(EffectManager.hasFullEffect(event.getEntity(), "cold")) {
            event.setCanceled(true);
            return;
        }

        if(ForestDataManager.hasCurse(event.getLevel(), "cold")) {
            CurseStorage.<ColdCurse>getCurse("cold").leftClickBlock(event);
        }
    }

    @SubscribeEvent
    public static void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
        Player player = event.getEntity();
        Level level = player.level();

        if(!level.isClientSide()) {
            PacketDistributor.sendToPlayer((ServerPlayer) player, new SyncCursesPacket(ForestDataManager.getCurseData(player.level()).getActiveCurses()));
            PacketDistributor.sendToPlayer((ServerPlayer) player, new SyncFoundAncientNotesPacket(ForestDataManager.getFoundAncientNoteData().get()));
        }
        
        if(Config.DATA_DEBUG_ON_PLAYER_CONNECTING.isTrue()) {
            player.sendSystemMessage(Component.literal("<Infinite Forest Server> curses: " + ForestDataManager.getActiveCurses(level)));
            player.sendSystemMessage(Component.literal("<Infinite Forest Server> found ancient notes by string id: " + ForestDataManager.getFoundAncientNotes(level)));
        
            PacketDistributor.sendToPlayer((ServerPlayer) player, new LogNeedForestDataPacket());
        }
    }
}

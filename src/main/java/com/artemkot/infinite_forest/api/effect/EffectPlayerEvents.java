package com.artemkot.infinite_forest.api.effect;

import java.util.UUID;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class EffectPlayerEvents {
    @SubscribeEvent
    public static void onPlayerTick(PlayerTickEvent.Post event) {
        // Player player = event.getEntity();
        // if(player.level().isClientSide()) return;
    
        // UUID targetUuid = player.getUUID();

        // MinecraftServer server = player.getServer();
        // if (server == null) return;

        // ServerPlayer targetPlayer = server.getPlayerList().getPlayer(targetUuid);

        // if (targetPlayer == null) return; 
        
        // PlayerEffectStorage storage = targetPlayer.getData(AttachmentList.PLAYER_EFFECTS.get());
        
    }
}

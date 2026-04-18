package com.artemkot.infinite_forest.common;

import com.artemkot.infinite_forest.Config;
import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.curse.ClientForestDataManager;
import com.artemkot.infinite_forest.common.world.ForestDataManager;

import net.minecraft.client.player.LocalPlayer;
import net.minecraft.network.chat.Component;
import net.minecraft.world.level.Level;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.ClientPlayerNetworkEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID, value = Dist.CLIENT)
public class ClientEvents {
    @SubscribeEvent
    public static void onClientPlayerLogin(ClientPlayerNetworkEvent.LoggingIn event) {
        //maybe in future here will be added something
    }

    @SubscribeEvent
    public static void onClientDisconnect(ClientPlayerNetworkEvent.LoggingOut event) {
        ClientForestDataManager.clear();
    }
}

package com.artemkot.infinite_forest.network.packets;

import com.artemkot.infinite_forest.InfiniteForest;

import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID, bus = EventBusSubscriber.Bus.MOD)
public class NetworkHandler {
    @SubscribeEvent
    public static void register(RegisterPayloadHandlersEvent event) {
        event.registrar("1").playToClient(
            SyncCursesPacket.TYPE,
            SyncCursesPacket.STREAM_CODEC,
            SyncCursesPacket::handle
        );
    }
}
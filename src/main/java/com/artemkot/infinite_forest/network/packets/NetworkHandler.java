package com.artemkot.infinite_forest.network.packets;

import com.artemkot.infinite_forest.InfiniteForest;

import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class NetworkHandler {
    @SubscribeEvent
    public static void register(RegisterPayloadHandlersEvent event) {
        event.registrar("1").playToClient(
            LogNeedForestDataPacket.TYPE, 
            LogNeedForestDataPacket.STREAM_CODEC, 
            LogNeedForestDataPacket::handle
        );

        event.registrar("1").playToClient(
            SyncCursesPacket.TYPE,
            SyncCursesPacket.STREAM_CODEC,
            SyncCursesPacket::handle
        );

        event.registrar("1").playToClient(
            SyncFoundAncientNotesPacket.TYPE, 
            SyncFoundAncientNotesPacket.STREAM_CODEC, 
            SyncFoundAncientNotesPacket::handle
        );

        event.registrar("1").playToClient(
            OpenAncientNoteScreenPacket.TYPE, 
            OpenAncientNoteScreenPacket.STREAM_CODEC, 
            OpenAncientNoteScreenPacket::handle
        );

        event.registrar("1").playToServer(
            AddFoundAncientNotePacket.TYPE, 
            AddFoundAncientNotePacket.STREAM_CODEC, 
            AddFoundAncientNotePacket::handle
        );
    }
}
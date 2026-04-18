package com.artemkot.infinite_forest.network.packets;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.network.handling.IPayloadContext;

import java.util.HashSet;
import java.util.Set;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.curse.ClientForestDataManager;

public record SyncCursesPacket(Set<String> curses) implements CustomPacketPayload {
    public static final Type<SyncCursesPacket> TYPE = new Type<>(
        ModResources.getResourceLocation("sync_curses")
    );
    
    public static final StreamCodec<ByteBuf, SyncCursesPacket> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8.apply(ByteBufCodecs.collection(HashSet::new)),
        SyncCursesPacket::curses,
        SyncCursesPacket::new
    );
    
    @Override
    public Type<SyncCursesPacket> type() {
        return TYPE;
    }
    
    public static void handle(SyncCursesPacket packet, IPayloadContext ctx) {
        ctx.enqueueWork(() -> {
            ClientForestDataManager.setCurses(packet.curses());
        });
    }
}
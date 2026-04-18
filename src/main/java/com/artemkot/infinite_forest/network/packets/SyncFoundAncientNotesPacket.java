package com.artemkot.infinite_forest.network.packets;

import java.lang.reflect.Type;
import java.util.HashSet;
import java.util.Set;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.curse.ClientForestDataManager;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.network.handling.IPayloadContext;

public record SyncFoundAncientNotesPacket(Set<String> found) implements CustomPacketPayload {
    public static final Type<SyncFoundAncientNotesPacket> TYPE = new Type<>(
        ModResources.getResourceLocation("sync_found_ancient_notes")
    );
    
    public static final StreamCodec<ByteBuf, SyncFoundAncientNotesPacket> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8.apply(ByteBufCodecs.collection(HashSet::new)),
        SyncFoundAncientNotesPacket::found,
        SyncFoundAncientNotesPacket::new
    );
    
    @Override
    public Type<SyncFoundAncientNotesPacket> type() {
        return TYPE;
    }
    
    public static void handle(SyncFoundAncientNotesPacket packet, IPayloadContext ctx) {
        ctx.enqueueWork(() -> {
            ClientForestDataManager.setFoundAncientNotes(packet.found());
        });
    }
}
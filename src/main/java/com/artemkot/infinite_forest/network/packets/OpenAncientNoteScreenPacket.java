package com.artemkot.infinite_forest.network.packets;

import com.artemkot.infinite_forest.client.ui.AncientNoteScreen;
import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.data_components.AncientNotePage;

import io.netty.buffer.ByteBuf;
import net.minecraft.client.Minecraft;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.network.handling.IPayloadContext;

public record OpenAncientNoteScreenPacket(AncientNotePage page) implements CustomPacketPayload {
    public static final Type<OpenAncientNoteScreenPacket> TYPE = new Type<>(
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "open_ancient_note_screen")
    );
    
    public static final StreamCodec<ByteBuf, OpenAncientNoteScreenPacket> STREAM_CODEC = StreamCodec.composite(
        AncientNotePage.STREAM_CODEC, OpenAncientNoteScreenPacket::page,
        OpenAncientNoteScreenPacket::new
    );
    
    @Override
    public Type<OpenAncientNoteScreenPacket> type() {
        return TYPE;
    }
    
    public static void handle(OpenAncientNoteScreenPacket packet, IPayloadContext ctx) {
        ctx.enqueueWork(() -> {
            Minecraft.getInstance().setScreen(new AncientNoteScreen(packet.page()));
        });
    }
}
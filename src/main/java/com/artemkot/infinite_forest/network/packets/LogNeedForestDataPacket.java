package com.artemkot.infinite_forest.network.packets;

import com.artemkot.infinite_forest.Config;
import com.artemkot.infinite_forest.common.world.ForestDataManager;

import io.netty.buffer.ByteBuf;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.ChatComponent;
import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.network.chat.Component;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.network.handling.IPayloadContext;

public record LogNeedForestDataPacket() implements CustomPacketPayload {
    public static final Type<LogNeedForestDataPacket> TYPE = new Type<>(
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "log_need_forest_data")
    );
    
    public static final StreamCodec<ByteBuf, LogNeedForestDataPacket> STREAM_CODEC = StreamCodec.unit(new LogNeedForestDataPacket());
    
    @Override
    public Type<LogNeedForestDataPacket> type() {
        return TYPE;
    }
    
    public static void handle(LogNeedForestDataPacket packet, IPayloadContext ctx) {
        ctx.enqueueWork(() -> {
            Minecraft mc = Minecraft.getInstance();
            ChatComponent chat = mc.gui.getChat();
            ClientLevel level = mc.level;

            if(Config.DATA_DEBUG_ON_PLAYER_CONNECTING.isTrue()) {
    
                chat.addMessage(Component.literal("<Infinite Forest Client> curses: " + ForestDataManager.getActiveCurses(level)));
                chat.addMessage(Component.literal("<Infinite Forest Client> found ancient notes by string id: " + ForestDataManager.getFoundAncientNotes(level)));
            }
        });
    }
}
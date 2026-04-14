package com.artemkot.infinite_forest.api.effect;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.network.protocol.game.ClientboundGameEventPacket.Type;
import net.minecraft.resources.ResourceLocation;

public record EffectSyncPacket(String id, int timer, int timerMax) implements CustomPacketPayload {
    public static final Type<EffectSyncPacket> TYPE = new Type<>(
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "effect_sync")
    );
    
    public static final StreamCodec<ByteBuf, EffectSyncPacket> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, EffectSyncPacket::id,
        ByteBufCodecs.INT, EffectSyncPacket::timer,
        ByteBufCodecs.INT, EffectSyncPacket::timerMax,
        EffectSyncPacket::new
    );
    
    @Override
    public Type<EffectSyncPacket> type() { 
        return TYPE; 
    }
}
package com.artemkot.infinite_forest.api.effect;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;

public class EffectPlayerData {
    public String id;
    public int timer;
    public int timerMax;

    public EffectPlayerData(String id, int timer, int timerMax) {
        this.id = id;
        this.timer = timer;
        this.timerMax = timerMax;
    }

    public static final Codec<EffectPlayerData> CODEC = RecordCodecBuilder.create(instance ->
        instance.group(
            Codec.STRING.fieldOf("id").forGetter(d -> d.id),
            Codec.INT.fieldOf("timer").forGetter(d -> d.timer),
            Codec.INT.fieldOf("timerMax").forGetter(d -> d.timerMax)
        ).apply(instance, EffectPlayerData::new)
    );
    
    public static final StreamCodec<ByteBuf, EffectPlayerData> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, d -> d.id,
        ByteBufCodecs.INT, d -> d.timer,
        ByteBufCodecs.INT, d -> d.timerMax,
        EffectPlayerData::new
    );
}
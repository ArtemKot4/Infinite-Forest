package com.artemkot.infinite_forest.common.item.data_components;

import java.util.Optional;

import javax.annotation.Nullable;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;

public record AncientNoteData(String stringId, String name, String description, @Nullable String learning) {
    public static final AncientNoteData EMPTY = new AncientNoteData("custom", "", "", "");

    public static final Codec<AncientNoteData> CODEC = RecordCodecBuilder.create(inst -> inst.group(
        Codec.STRING.fieldOf("stringId").forGetter(AncientNoteData::stringId),
        Codec.STRING.fieldOf("name").forGetter(AncientNoteData::name),
        Codec.STRING.fieldOf("description").forGetter(AncientNoteData::description),
        Codec.STRING.optionalFieldOf("learning").forGetter(d -> Optional.ofNullable(d.learning))
    ).apply(inst, (stringId, name, description, learning) -> new AncientNoteData(stringId, name, description, learning.orElse(null))));

   public static final StreamCodec<ByteBuf, AncientNoteData> STREAM_CODEC = StreamCodec.of(
    (buf, data) -> {
        ByteBufCodecs.STRING_UTF8.encode(buf, data.stringId());
        ByteBufCodecs.STRING_UTF8.encode(buf, data.name());
        ByteBufCodecs.STRING_UTF8.encode(buf, data.description());
        ByteBufCodecs.STRING_UTF8.encode(buf, data.learning() == null ? "" : data.learning());
    },
    buf -> {
        String stringId = ByteBufCodecs.STRING_UTF8.decode(buf);
        String name = ByteBufCodecs.STRING_UTF8.decode(buf);
        String description = ByteBufCodecs.STRING_UTF8.decode(buf);
        String learning = ByteBufCodecs.STRING_UTF8.decode(buf);

        return new AncientNoteData(
            stringId,
            name,
            description,
            learning
        );
    }
);
}
package com.artemkot.infinite_forest.common.item.data_components;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;

import org.checkerframework.checker.nullness.qual.NonNull;
import org.checkerframework.checker.nullness.qual.Nullable;

public record AncientNotePage(@NonNull String stringId, @NonNull Author author, @NonNull String name, @NonNull String description, @Nullable String learning) {
    public AncientNotePage {
        if(learning == null) {
            learning = "";
        }
    }

    public AncientNotePage(@NonNull String stringId, @NonNull Author author) {
        this(stringId, author, "", "", "");
    }

    public AncientNotePage(@NonNull Author author) {
        this("custom", author, "", "", "");
    }

    public boolean isContentEmpty() {
        return name.trim().equals("") && description.trim().equals("");
    }

    public boolean isStringId(String stringId) {
        return this.stringId.equals(stringId);
    }

    public boolean isCustom() {
        return stringId.equals("custom");
    }

    public boolean isUnknown() {
        return stringId.equals("unknown");
    }

    public static AncientNotePage ERROR = new AncientNotePage("custom", Author.ETHER, "Error with loading", "Guess, you got error. Please send bug report", null);
    public static AncientNotePage CUSTOM = new AncientNotePage("custom", Author.PLAYER, "", "", null);
    public static AncientNotePage EMPTY = new AncientNotePage(Author.PLAYER);

     public static final Codec<AncientNotePage> CODEC = RecordCodecBuilder.create(inst -> inst.group(
        Codec.STRING.fieldOf("stringId").forGetter(AncientNotePage::stringId),
        Author.CODEC.fieldOf("author").forGetter(AncientNotePage::author),
        Codec.STRING.fieldOf("name").forGetter(AncientNotePage::name),
        Codec.STRING.fieldOf("description").forGetter(AncientNotePage::description),
        Codec.STRING.fieldOf("learning").forGetter(AncientNotePage::learning)
    ).apply(inst, AncientNotePage::new));
    
    public static final StreamCodec<ByteBuf, AncientNotePage> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, AncientNotePage::stringId,
        Author.STREAM_CODEC, AncientNotePage::author,
        ByteBufCodecs.STRING_UTF8, AncientNotePage::name,
        ByteBufCodecs.STRING_UTF8, AncientNotePage::description,
        ByteBufCodecs.STRING_UTF8, AncientNotePage::learning,
        AncientNotePage::new
    );
}

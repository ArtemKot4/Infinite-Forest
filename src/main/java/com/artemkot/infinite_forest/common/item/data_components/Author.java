package com.artemkot.infinite_forest.common.item.data_components;

import javax.annotation.Nonnull;

import org.checkerframework.checker.nullness.qual.NonNull;

import com.artemkot.infinite_forest.ModResources;
import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.resources.ResourceLocation;

public record Author(@Nonnull String name, @Nonnull ResourceLocation textFont, @NonNull int textLineSize) {
    public static final Codec<Author> CODEC = RecordCodecBuilder.create(inst -> inst.group(
        Codec.STRING.fieldOf("name").forGetter(Author::name),
        ResourceLocation.CODEC.fieldOf("textFont").forGetter(Author::textFont),
        Codec.INT.fieldOf("textLineSize").forGetter(Author::textLineSize)
    ).apply(inst, Author::new));
    
    public static final StreamCodec<ByteBuf, Author> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, Author::name,
        ResourceLocation.STREAM_CODEC, Author::textFont,
        ByteBufCodecs.INT, Author::textLineSize,
        Author::new
    );
    
    public static Author PLAYER = new Author("", ModResources.getResourceLocation("player"), 16);
    public static Author ETHER = new Author("name.infinite_forest.ether", ModResources.getResourceLocation("ancient_note_ether"), 16);
    public static Author ARCHIEBALD = new Author("name.infinite_forest.archiebald", ModResources.getResourceLocation("ancient_note_scientist"), 25);
    public static Author INFINITE_FOREST = new Author("infinite_forest", ModResources.getResourceLocation("infinite_forest"), 19);
    
    public Author copyWith(String newName) {
        return new Author(newName, textFont, textLineSize);
    }
}
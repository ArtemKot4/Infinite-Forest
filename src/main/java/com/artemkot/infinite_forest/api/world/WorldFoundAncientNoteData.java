package com.artemkot.infinite_forest.api.world;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import com.artemkot.infinite_forest.network.packets.SyncCursesPacket;
import com.mojang.serialization.Codec;

import net.minecraft.core.HolderLookup;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.nbt.ListTag;
import net.minecraft.nbt.StringTag;
import net.minecraft.nbt.Tag;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.level.saveddata.SavedData;
import net.neoforged.neoforge.network.PacketDistributor;
import net.neoforged.neoforge.server.ServerLifecycleHooks;

public class WorldFoundAncientNoteData extends SavedData {
    private Set<String> found = new HashSet<>();

    public static final Codec<WorldFoundAncientNoteData> CODEC = 
        Codec.STRING.listOf().xmap(
            list -> {
                WorldFoundAncientNoteData data = new WorldFoundAncientNoteData();
                for(String note : list) {
                    data.found.add(note);
                }
                return data;
            },
            storage -> new ArrayList<>(storage.found)
        );

    public WorldFoundAncientNoteData() {}

    public void add(String ancientNote) {
        found.add(ancientNote);
        setDirty();
    }
    
    public boolean has(String ancientNoteId) {
        return found.contains(ancientNoteId);
    }
    
    public Set<String> get() {
        return Collections.unmodifiableSet(found);
    }
    
    @Override
    public CompoundTag save(CompoundTag tag, HolderLookup.Provider registries) {
        ListTag list = new ListTag();
        for(String foundId : found) {
            list.add(StringTag.valueOf(foundId));
        }
        tag.put("found_ancient_notes", list);
        return tag;
    }
    
    public static WorldFoundAncientNoteData load(CompoundTag tag, HolderLookup.Provider registries) {
        WorldFoundAncientNoteData data = new WorldFoundAncientNoteData();
        ListTag list = tag.getList("found_ancient_notes", Tag.TAG_STRING);
        for(int i = 0; i < list.size(); i++) {
            data.found.add(list.getString(i));
        }
        return data;
    }
}

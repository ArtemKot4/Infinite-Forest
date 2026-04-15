package com.artemkot.infinite_forest.api.curse;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import com.mojang.serialization.Codec;

import net.minecraft.core.HolderLookup;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.nbt.ListTag;
import net.minecraft.nbt.StringTag;
import net.minecraft.nbt.Tag;
import net.minecraft.world.level.saveddata.SavedData;
public class WorldCurseData extends SavedData {
    private Set<String> activeCurses = new HashSet<>();
    
    public static final Codec<WorldCurseData> CODEC = 
        Codec.STRING.listOf().xmap(
            list -> {
                WorldCurseData data = new WorldCurseData();
                data.activeCurses.addAll(list);
                return data;
            },
            storage -> new ArrayList<>(storage.activeCurses)
        );

    private WorldCurseData() {}
    
    public static WorldCurseData createNew() {
        WorldCurseData data = new WorldCurseData();
        data.activeCurses = new HashSet<>(CurseStorage.CURSES.keySet());
        return data;
    }

    public void addCurse(String curseId) {
        activeCurses.add(curseId);
        setDirty();
    }
    
    public void removeCurse(String curseId) {
        activeCurses.remove(curseId);
        setDirty();
    }
    
    public boolean hasCurse(String curseId) {
        return activeCurses.contains(curseId);
    }
    
    public Set<String> getActiveCurses() {
        return Collections.unmodifiableSet(activeCurses);
    }
    
    @Override
    public CompoundTag save(CompoundTag tag, HolderLookup.Provider registries) {
        ListTag list = new ListTag();
        for(String curse : activeCurses) {
            list.add(StringTag.valueOf(curse));
        }
        tag.put("curses", list);
        return tag;
    }
    
    public static WorldCurseData load(CompoundTag tag, HolderLookup.Provider registries) {
        WorldCurseData data = new WorldCurseData();
        ListTag list = tag.getList("curses", Tag.TAG_STRING);
        for(int i = 0; i < list.size(); i++) {
            data.activeCurses.add(list.getString(i));
        }
        return data;
    }
}
package com.artemkot.infinite_forest.common.world;

import java.util.Set;

import com.artemkot.infinite_forest.api.curse.ClientForestDataManager;
import com.artemkot.infinite_forest.api.world.WorldCurseData;
import com.artemkot.infinite_forest.api.world.WorldFoundAncientNoteData;
import com.artemkot.infinite_forest.common.item.data_components.AncientNotePage;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.world.level.storage.DimensionDataStorage;
import net.neoforged.neoforge.server.ServerLifecycleHooks;

public class ForestDataManager {
    private static final String DATA_NAME = "infinite_forest_world_curses";

    public static WorldCurseData getCurseData(Level level) {
        if(level.isClientSide()) return null;
        return getCurseData((ServerLevel) level);
    }

    public static WorldCurseData getCurseData(ServerLevel level) {
        DimensionDataStorage storage = level.getDataStorage();

        return storage.computeIfAbsent(new SavedData.Factory<>(WorldCurseData::createNew, WorldCurseData::load),
                DATA_NAME);
    }

    public static WorldCurseData getCurseData(MinecraftServer server) {
        ServerLevel forestLevel = server.getLevel(InfiniteForestDimension.FOREST_DIMENSION);
        if(forestLevel == null) {
            throw new IllegalStateException("Infinite Forest not loaded! Make sure it's registered and initialized before accessing curse data.");
        }
        return getCurseData(forestLevel);
    }
    public static WorldCurseData getCurseData() {
        MinecraftServer server = ServerLifecycleHooks.getCurrentServer();
        if(server == null)
            return null;
        return getCurseData(server);
    }

    public static Set<String> getActiveCurses(Level level) {
        if(level.isClientSide()) {
            return ClientForestDataManager.getActiveCurses();
        }
        WorldCurseData data = getCurseData((ServerLevel) level);
        return data != null ? data.getActiveCurses() : Set.of();
    }

    public static boolean hasCurse(Level level, String curse) {
        if(level.isClientSide()) {
            return ClientForestDataManager.hasCurse(curse);
        }
        WorldCurseData data = getCurseData((ServerLevel) level);
        return data != null && data.hasCurse(curse);
    }

    public static WorldFoundAncientNoteData getFoundAncientNoteData() {
        ServerLevel forestLevel = ServerLifecycleHooks.getCurrentServer().getLevel(InfiniteForestDimension.FOREST_DIMENSION);
        
        if(forestLevel == null) {
            throw new IllegalStateException("Infinite Forest not loaded! Make sure it's registered and initialized before accessing ancient note data");
        }
        DimensionDataStorage storage = forestLevel.getDataStorage();

        return storage.computeIfAbsent(
                new SavedData.Factory<>(WorldFoundAncientNoteData::new, WorldFoundAncientNoteData::load),
                "infinite_forest_found_notes");
    }

    public static Set<String> getFoundAncientNotes(Level level) {
        if(level.isClientSide()) {
            return ClientForestDataManager.getFoundAncientNotes();
        }
        
        return getFoundAncientNoteData().get();
    }

    /**
     * Server method — проверяет, найдена ли записка в измерении InfiniteForest
     */
    public static boolean isFoundAncientNote(String found) {
        WorldFoundAncientNoteData data = getFoundAncientNoteData();
        return data != null && data.has(found);
    }

    public static void addFoundAncientNote(String found) {
        WorldFoundAncientNoteData data = getFoundAncientNoteData();
        data.add(found);
    }
}
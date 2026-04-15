package com.artemkot.infinite_forest.common.world;

import com.artemkot.infinite_forest.api.curse.WorldCurseData;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.world.level.storage.DimensionDataStorage;

public class WorldDataHandler {
    private static final String DATA_NAME = "infinite_forest_world_curses";
    
    public static WorldCurseData get(Level level) {
        if(level.isClientSide()) return null;
        
        ServerLevel overworld = level.getServer().overworld();
        DimensionDataStorage storage = overworld.getDataStorage();
        
        return storage.computeIfAbsent(
            new SavedData.Factory<>(
                WorldCurseData::createNew,
                WorldCurseData::load
            ),
            DATA_NAME
        );
    }
    
    public static WorldCurseData get(MinecraftServer server) {
        ServerLevel overworld = server.overworld();
        DimensionDataStorage storage = overworld.getDataStorage();
        
        return storage.computeIfAbsent(
            new SavedData.Factory<>(
                WorldCurseData::createNew,
                WorldCurseData::load
            ),
            DATA_NAME
        );
    }
}
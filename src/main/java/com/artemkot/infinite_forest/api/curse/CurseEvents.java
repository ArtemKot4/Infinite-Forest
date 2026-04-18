package com.artemkot.infinite_forest.api.curse;

import com.artemkot.infinite_forest.common.world.InfiniteForestDimension;
import com.artemkot.infinite_forest.common.world.ForestDataManager;

import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class CurseEvents {
    public static void tick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();
        Level level = player.level();

        for(String curseId : ForestDataManager.getActiveCurses(level)) {
            Curse curse = CurseStorage.getCurse(curseId);
            if(!curse.everywhere() && !level.dimension().equals(InfiniteForestDimension.FOREST_DIMENSION)) {
                continue;
            }
            if(level.isClientSide) {
                curse.onClientTick(event);
                continue;
            } 
            curse.onServerTick(event);
        }
    }
}

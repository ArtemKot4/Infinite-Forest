package com.artemkot.infinite_forest.api.curse;

import java.util.Iterator;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectManager;
import com.artemkot.infinite_forest.api.effect.EffectStorage;
import com.artemkot.infinite_forest.common.world.InfiniteForestDimension;
import com.artemkot.infinite_forest.common.world.WorldDataHandler;
import com.artemkot.infinite_forest.common.world.curse.ColdCurse;

import net.minecraft.core.BlockPos;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class CurseEvents {
    public static void tick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();
        Level level = player.level();

        for(String curseId : WorldDataHandler.getActiveCurses(level)) {
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

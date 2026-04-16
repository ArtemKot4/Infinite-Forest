package com.artemkot.infinite_forest.api.curse;

import java.util.Iterator;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectPlayerStorage;
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

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class CurseEvents {
    @SubscribeEvent
    public static void onLeftClickBlock(PlayerInteractEvent.LeftClickBlock event) {
        Player player = event.getEntity();
        Level level = player.level();
        BlockPos pos = event.getPos();
        BlockState state = level.getBlockState(pos);
        
        if(!CurseStorage.<ColdCurse>getCurse("cold").isCursedBlock(state.getBlock())) {
            return;
        }

        if(level.isClientSide()) { 
            event.setCanceled(true);
            return; 
        }
        if(!WorldDataHandler.get(level).hasCurse("cold")) {
            return;
        }
        event.setCanceled(true);
        EffectPlayerStorage.addEffect(player, new EffectPlayerData("cold", 30));
    }

    public static void tick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();
        Level level = player.level();

        for(String curseId : WorldDataHandler.get(level).getActiveCurses()) {
            Curse curse = CurseStorage.getCurse(curseId);
            if(!curse.everywhere() && !level.dimension().equals(InfiniteForestDimension.FOREST_DIMENSION)) {
                continue;
            } 
            curse.onServerTick(event);
        }
    }
}

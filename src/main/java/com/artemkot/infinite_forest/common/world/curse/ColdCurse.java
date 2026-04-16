package com.artemkot.infinite_forest.common.world.curse;

import java.util.HashSet;
import java.util.Random;

import com.artemkot.infinite_forest.api.curse.Curse;
import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectPlayerStorage;
import com.artemkot.infinite_forest.common.world.WorldDataHandler;

import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.util.RandomSource;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class ColdCurse extends Curse {
    public HashSet<Block> cursedBlocks = new HashSet();

    public void runSnowInRadius(Level level, double x, double y, double z, int radius, int count) {
        if(level.getGameTime() % 8 == 0) {
            RandomSource random = level.getRandom();
            
            for(int n = -count; n <= count; n++) {
                level.addParticle(
                    ParticleTypes.SNOWFLAKE,
                    x + n, y, z + random.nextInt(radius * 2 + 1) - radius,
                    0.05, -0.1, 0
                );
                
                level.addParticle(
                    ParticleTypes.SNOWFLAKE,
                    x + random.nextInt(radius * 2 + 1) - radius, y, z + n,
                    0.05, -0.1, 0
                );
            }
        }
    }

    public boolean isSkyPosition(double y) {
        return y > 350;
    }

    @Override
    public void onServerTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(isSkyPosition(player.getY())) {
            EffectPlayerStorage.addEffect(player, new EffectPlayerData("cold", 500, 30));
        }
    }

    @Override
    public void onClientTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(player.level().getGameTime() % 10 == 0 && isSkyPosition(player.getY())) {
            runSnowInRadius(player.level(), player.getX(), player.getY(), player.getZ(), 16, 16);
        }
    }

    public void adCursedBlock(Block block) {
        cursedBlocks.add(block);
    }

    public boolean isCursedBlock(Block block) {
        return cursedBlocks.contains(block);
    }

    public void leftClickBlock(PlayerInteractEvent.LeftClickBlock event) {
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

}

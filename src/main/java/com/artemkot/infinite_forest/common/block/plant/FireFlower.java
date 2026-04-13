package com.artemkot.infinite_forest.common.block.plant;

import com.artemkot.infinite_forest.common.block.ForestFlower;

import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;

public class FireFlower extends ForestFlower {
    @Override
    public void animateTick(BlockState state, Level level, BlockPos pos, RandomSource random) {
        if(random.nextFloat() < 0.2f) {
            double x = pos.getX() + 0.45 + random.nextDouble() / 10;
            double y = pos.getY() + 0.75 + random.nextDouble() / 10;
            double z = pos.getZ() + 0.45 + random.nextDouble() / 10;
            
            level.addParticle(
                ParticleTypes.FLAME,
                x, y, z,
                0, 0.01, 0
            );
        }
    }
}

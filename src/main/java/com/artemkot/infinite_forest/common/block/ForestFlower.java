package com.artemkot.infinite_forest.common.block;

import javax.annotation.Nullable;

import com.artemkot.infinite_forest.api.effect.EffectType;
import com.mojang.serialization.MapCodec;

import net.minecraft.core.BlockPos;
import net.minecraft.world.level.BlockGetter;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.BushBlock;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.material.MapColor;

public class ForestFlower extends BushBlock {
    public ForestFlower() {
        super(BlockBehaviour.Properties.of()
            .mapColor(MapColor.PLANT)
                .noCollission()
                .instabreak()
                .sound(SoundType.GRASS)
                .offsetType(BlockBehaviour.OffsetType.XZ)
            );
    }

    @Override
    protected boolean mayPlaceOn(BlockState state, BlockGetter level, BlockPos pos) {
        return (
            state.is(Blocks.GRASS_BLOCK) || 
            state.is(Blocks.DIRT) || 
            state.is(Blocks.COARSE_DIRT) ||
            state.is(Blocks.ROOTED_DIRT) ||
            state.is(Blocks.PODZOL)     
        );
    }

    protected @Nullable EffectType getEffect() {
        return null;
    }

    @Override
    protected MapCodec<? extends BushBlock> codec() {
        return MapCodec.unit(ForestFlower::new);
    }
}
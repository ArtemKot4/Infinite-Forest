package com.artemkot.infinite_forest.common.block;

import com.artemkot.infinite_forest.InfiniteForest;

import net.minecraft.core.registries.Registries;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.inventory.MenuType;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.block.state.BlockBehaviour.OffsetType;
import net.minecraft.world.level.material.MapColor;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredRegister;

public class BlockList {
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(InfiniteForest.MOD_ID);

    public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES = DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE, InfiniteForest.MOD_ID);
    public static final DeferredRegister<MenuType<?>> MENUS = DeferredRegister.create(Registries.MENU, InfiniteForest.MOD_ID);

    public static final DeferredBlock<ForestFlower> FIRE_FLOWER = BLOCKS.register("fire_flower", ForestFlower::new);
    public static final DeferredBlock<ForestFlower> MOON_FLOWER = BLOCKS.register("moon_flower", ForestFlower::new);
    //для датагенов: DeferredRegister#getEntries пройтись по всем блокам и вызвать их методы для получения нужных данных
}
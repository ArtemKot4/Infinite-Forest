package com.artemkot.infinite_forest.world;

import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.Level;

public class InfiniteForest {
    public static final ResourceKey<Level> FOREST_DIMENSION = 
        ResourceKey.create(
            Registries.DIMENSION,
            ResourceLocation.fromNamespaceAndPath(com.artemkot.infinite_forest.InfiniteForest.MOD_ID, "infinite_forest")
        );
}
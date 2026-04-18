package com.artemkot.infinite_forest.common;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.api.effect.EffectStorage;
import com.artemkot.infinite_forest.common.block.BlockList;
import com.artemkot.infinite_forest.common.effect.ColdEffect;
import com.artemkot.infinite_forest.common.effect.FearEffect;
import com.artemkot.infinite_forest.common.world.curse.ColdCurse;
import com.artemkot.infinite_forest.common.world.curse.LightningCurse;

import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.fml.event.lifecycle.FMLCommonSetupEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class ModRegistry {
    @SubscribeEvent
    public static void onCommonSetup(FMLCommonSetupEvent event) {
        EffectStorage.registerEffect("cold", new ColdEffect());
        EffectStorage.registerEffect("fear", new FearEffect());
        CurseStorage.registerCurse("cold", new ColdCurse());
        CurseStorage.registerCurse("lightning", new LightningCurse());

        CurseStorage.<ColdCurse>getCurse("cold").addCursedBlock(BlockList.MOON_FLOWER.get());
    }
}
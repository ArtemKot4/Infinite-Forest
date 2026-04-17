package com.artemkot.infinite_forest;

import org.slf4j.Logger;

import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.api.effect.EffectStorage;
import com.artemkot.infinite_forest.common.CreativeTabList;
import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.block.BlockList;
import com.artemkot.infinite_forest.common.effect.ColdEffect;
import com.artemkot.infinite_forest.common.effect.FearEffect;
import com.artemkot.infinite_forest.common.item.ancient_note.ItemList;
import com.artemkot.infinite_forest.common.world.curse.ColdCurse;
import com.artemkot.infinite_forest.common.world.curse.LightningCurse;
import com.artemkot.infinite_forest.common.world.sky.Sky;
import com.mojang.logging.LogUtils;

import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.Mod;
import net.neoforged.fml.config.ModConfig;
import net.neoforged.fml.ModContainer;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.event.server.ServerStartingEvent;


@Mod(InfiniteForest.MOD_ID)
public class InfiniteForest {
    public static final String MOD_ID = "infinite_forest";
    public static final Logger LOGGER = LogUtils.getLogger();

    public InfiniteForest(IEventBus modEventBus, ModContainer modContainer) {
        modEventBus.addListener(DataGenerators::new);

        BlockList.BLOCKS.register(modEventBus);
        ItemList.ITEMS.register(modEventBus); 
        CreativeTabList.TABS.register(modEventBus);
        DataComponentList.COMPONENTS.register(modEventBus);
        NeoForge.EVENT_BUS.register(this);

        modContainer.registerConfig(ModConfig.Type.COMMON, Config.SPEC);

        AttachmentList.ATTACHMENTS.register(modEventBus);

        if(Dist.CLIENT.isClient()) {
            modEventBus.addListener(Sky::register);
        }
    }

    @SubscribeEvent
    public void onServerStarting(ServerStartingEvent event) {}
}

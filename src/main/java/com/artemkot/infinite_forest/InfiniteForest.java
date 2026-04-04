package com.artemkot.infinite_forest;

import org.slf4j.Logger;

import com.artemkot.infinite_forest.blocks.BlockList;
import com.artemkot.infinite_forest.items.ancient_note.ItemList;
import com.artemkot.infinite_forest.world.sky.Sky;
import com.mojang.logging.LogUtils;

import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.Mod;
import net.neoforged.fml.config.ModConfig;
import net.neoforged.fml.ModContainer;
import net.neoforged.fml.event.lifecycle.FMLCommonSetupEvent;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.event.server.ServerStartingEvent;

@Mod(InfiniteForest.MOD_ID)
public class InfiniteForest {
    public static final String MOD_ID = "infinite_forest";
    public static final Logger LOGGER = LogUtils.getLogger();

    public InfiniteForest(IEventBus modEventBus, ModContainer modContainer) {
        modEventBus.addListener(this::commonSetup);

        BlockList.BLOCKS.register(modEventBus);
        ItemList.ITEMS.register(modEventBus); 
        CreativeTabList.TABS.register(modEventBus);
        DataComponentList.COMPONENTS.register(modEventBus);

        NeoForge.EVENT_BUS.register(this);
        NeoForge.EVENT_BUS.register(new Events());

        modContainer.registerConfig(ModConfig.Type.COMMON, Config.SPEC);

        if(Dist.CLIENT.isClient()) {
            modEventBus.addListener(Sky::register);
        }
    }

    private void commonSetup(FMLCommonSetupEvent event) {}

    @SubscribeEvent
    public void onServerStarting(ServerStartingEvent event) {}
}

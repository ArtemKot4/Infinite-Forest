package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.InfiniteForest;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.RenderGuiEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID, value = Dist.CLIENT)
public class EffectOverlayEvent {
    
    private static boolean shouldRender = false;
    private static final ResourceLocation TEXTURE = 
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "textures/ui/effect/winter_scale.png");
    
    public static EffectHud TEST = new EffectHud(TEXTURE);

    @SubscribeEvent
    public static void onRenderGui(RenderGuiEvent.Post event) {
        Minecraft mc = Minecraft.getInstance();
        if(!shouldRender || mc.screen != null) {
            return;
        }

        RenderSystem.enableBlend();
        RenderSystem.defaultBlendFunc();

        TEST.draw(event.getGuiGraphics(), mc);
     
        RenderSystem.disableBlend();
    }
    
    public static void show() {
        shouldRender = true;
    }
    
    public static void hide() {
        shouldRender = false;
    }

    @SubscribeEvent
    public static void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
        EffectOverlayEvent.show();
    }
}

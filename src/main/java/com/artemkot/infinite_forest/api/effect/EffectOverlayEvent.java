package com.artemkot.infinite_forest.api.effect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Items;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.RenderGuiEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID, value = Dist.CLIENT)
public class EffectOverlayEvent {
    public static void update(EffectHud hud, EffectPlayerData effectData, GuiGraphics graphics, Minecraft mc) {
        hud
        .setEffectData(effectData)
        .setGraphics(graphics)
        .setMinecraft(mc);
    }

    public static HashMap<String, Integer> queue = new HashMap<>();

    @SubscribeEvent
    public static void onRenderGui(RenderGuiEvent.Post event) {
        Minecraft mc = Minecraft.getInstance();
        LocalPlayer player = mc.player;
        
        if(mc.screen != null || player == null || (player.isCreative() || player.isSpectator())) {
            return;
        }
        RenderSystem.enableBlend();
        RenderSystem.defaultBlendFunc();

        EffectManager storage = player.getData(AttachmentList.PLAYER_EFFECTS.get());
        Collection<EffectPlayerData> effects = storage.getActiveEffects();
        GuiGraphics graphics = event.getGuiGraphics();
        int yOffset = 5;

        for(EffectPlayerData effectData : effects) {
            EffectType effect = EffectStorage.getEffect(effectData.id);
            if(effect == null) {
                continue;
            }
            EffectHud hud = effect.getHud();
            if(!hud.preInited && effectData.timer < effectData.timerMax && effectData.duration > 0) {
                hud.onPreInit();
                hud.reset();
                hud.preInited = true;
                update(hud, effectData, graphics, mc);
                hud.onPostInit();
            }
            update(hud, effectData, graphics, mc);
            hud.setDefaultY(yOffset);
            hud.draw();

            if(!hud.terminated && effectData.timer == 0 && effectData.duration == 0) {
                hud.onTerminate();
                hud.terminated = true;
                hud.preInited = false;
            }
            yOffset += 13;
        }   
     
        RenderSystem.disableBlend();
    }
}

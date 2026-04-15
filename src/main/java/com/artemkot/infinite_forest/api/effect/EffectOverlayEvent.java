package com.artemkot.infinite_forest.api.effect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
    @SubscribeEvent
    public static void onRenderGui(RenderGuiEvent.Post event) {
        Minecraft mc = Minecraft.getInstance();
        LocalPlayer player = mc.player;
        
        if(mc.screen != null || player == null) {
            return;
        }

        RenderSystem.enableBlend();
        RenderSystem.defaultBlendFunc();

        PlayerEffectStorage storage = player.getData(AttachmentList.PLAYER_EFFECTS.get());
        Collection<EffectPlayerData> effects = storage.getActiveEffects();
    
        int yOffset = 5;
        for(EffectPlayerData effectData : effects) {
            EffectType effect = EffectStorage.getEffect(effectData.id);
            if (effect != null) {
                EffectHud hud = effect.getHud();
                if(effectData.timer < 5 && effectData.duration == effectData.timerMax) {
                    hud.clear();
                }

                hud.setDefaultY(yOffset).draw(event.getGuiGraphics(), mc, effectData);
                yOffset += 13;
            }
        }   
     
        RenderSystem.disableBlend();
    }


    //debug
    @SubscribeEvent
    public static void onRightClick(PlayerInteractEvent.RightClickItem event) {
        Player player = event.getEntity();
        
        if(player.getItemInHand(event.getHand()).getItem() != Items.STICK) {
            return;
        }
        if(player.level().isClientSide()) {
            return;
        }
        
        PlayerEffectStorage storage = player.getData(AttachmentList.PLAYER_EFFECTS.get());
        if(storage == null) return;
        
        storage.addEffect(new EffectPlayerData("cold", 0, 50, 50));
        
        event.setCanceled(true);
    }
}

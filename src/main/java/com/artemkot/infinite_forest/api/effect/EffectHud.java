package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.ModResources;
import com.mojang.blaze3d.systems.RenderSystem;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;

import com.mojang.blaze3d.systems.RenderSystem;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.RenderGuiEvent;

@OnlyIn(Dist.CLIENT)
public class EffectHud {
    protected static ResourceLocation borderTexture = ModResources.getTextureUI("effect/border.png");
    protected static ResourceLocation scaleBackgroundTexture = ModResources.getTextureUI("effect/default_scale_background.png");
    protected int defaultY;

    protected final ResourceLocation scaleTexture;
    protected int x;
    protected int y;
    protected double scaleState; // from 0 (empty) to 1 (full)
    protected boolean appear = true;
    protected boolean disappear = false;
    protected double alpha = 0;

    public EffectHud(ResourceLocation scaleTexture) {
        this.scaleTexture = scaleTexture;
        this.setDefaultY(5);
    }

    public void setDefaultY(int defaultY) {
        this.defaultY = defaultY;
        this.y = defaultY;
    }

    public void draw(GuiGraphics graphics, Minecraft mc) {
        int screenWidth = mc.getWindow().getGuiScaledWidth();
        this.x = (screenWidth - 93) / 2;

        if(alpha < 1) { 
            if(appear == true) {
                graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);
                alpha = Math.min(1, alpha + 0.008);
            }
        } else {
            appear = false;
            scaleState = Math.min(1, scaleState + 0.008);
        } 

        if(alpha > 0) {
            if(disappear) {
                graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);
                alpha = Math.max(0, alpha - 0.008);
            }
        } else {
            disappear = false;
        }

        graphics.blit(borderTexture, x, y, 0, 0, 93, 13, 93, 13);
        graphics.blit(scaleBackgroundTexture, x + 8, y + 2, 0, 0, 77, 9, 77, 9);
        graphics.blit(scaleTexture, x + 8, y + 2, 0, 0, (int) (77 * scaleState), 9, 77, 9);
    }

    public void clear() {
        this.scaleState = 0;
        this.y = defaultY;
        this.appear = true;
        this.disappear = false;
        this.alpha = 0;
    }
}
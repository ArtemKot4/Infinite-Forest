package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.Config;
import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;

@OnlyIn(Dist.CLIENT)
public class EffectHud {
    protected static ResourceLocation borderTexture = ModResources.getTextureUI("effect/border.png");
    protected static ResourceLocation scaleBackgroundTexture = ModResources.getTextureUI("effect/default_scale_background.png");
    protected int defaultY;

    protected final ResourceLocation scaleTexture;
    protected final ResourceLocation scaleIconTexture;
    protected int x;
    protected int y;
    protected double alpha = 0;
    protected int scaleState = 0;

    public EffectHud(ResourceLocation scaleTexture, ResourceLocation scaleIconTexture) {
        this.scaleTexture = scaleTexture;
        this.scaleIconTexture = scaleIconTexture;
        this.setDefaultY(5);
    }

    public EffectHud setDefaultY(int defaultY) {
        this.defaultY = defaultY;
        this.y = defaultY;
        return this;
    }

    public void calculateAnimation(int timer, int timerMax, int duration) {
        float progress = (float) timer / timerMax;
        boolean addingState = duration > 0;

        if(addingState) {
            if(alpha < 1) {
                alpha = Math.min(1, alpha + 0.008);
            }
        } else {
            if(timer <= timerMax / 5.5 && alpha > 0) {
                alpha = Math.max(0, alpha - 0.025);
            }
        }
        scaleState = (int) (77 * progress);
    }

    public void draw(GuiGraphics graphics, Minecraft mc, EffectPlayerData effectData) {
        int screenWidth = mc.getWindow().getGuiScaledWidth();
        this.x = (screenWidth - 93) / 2;
        
        this.calculateAnimation(effectData.timer, effectData.timerMax, effectData.duration);
        
        graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);

        graphics.blit(borderTexture, x, y, 0, 0, 93, 13, 93, 13);
        graphics.blit(scaleBackgroundTexture, x + 8 + 4, y + 2, 0, 0, 77, 9, 77, 9);
        graphics.blit(scaleTexture, x + 8 + 4, y + 2, 0, 0, scaleState, 9, 77, 9);
        graphics.blit(scaleIconTexture, x + 2, y + 2, 0, 0, 9, 9, 9, 9);
        
        
        if(Config.EFFECT_DATA_LOGGING.get()) {
            graphics.drawString(mc.font, 
                Component.literal(effectData.duration + " of " + effectData.timer + ":" + effectData.timerMax)
                    .withStyle(style -> style.withFont(AncientNote.Author.ETHER.textFont())), 
                x + 93 + 5, y + 4, 0xFFFFFF, false);
        }
    }

    public void clear() {
        this.y = defaultY;
        this.scaleState = 0;
        this.alpha = 0;
    }
}
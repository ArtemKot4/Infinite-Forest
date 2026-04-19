package com.artemkot.infinite_forest.api.effect;

import javax.annotation.Nullable;

import com.artemkot.infinite_forest.Config;
import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote;
import com.artemkot.infinite_forest.common.item.data_components.Author;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;

@OnlyIn(Dist.CLIENT)
public class EffectHud {
    protected static ResourceLocation BORDER_TEXTURE = ModResources.getTextureUI("effect/border.png");
    public static final int BORDER_TEXTURE_WIDTH = 103;
    public static final int BORDER_TEXTURE_HEIGHT = 21;
    protected int defaultY;

    protected final ResourceLocation scaleTexture;
    protected final ResourceLocation scaleEmptyTexture;
    protected int x;
    protected int y;
    protected double alpha = 0;
    protected int scaleState = 0;
    protected boolean terminated = false;
    protected boolean preInited = false;

    protected GuiGraphics graphics;
    protected Minecraft mc;
    protected EffectPlayerData effectData;

    public EffectHud(ResourceLocation scaleEmptyTexture, ResourceLocation scaleTexture) {
        this.scaleEmptyTexture = scaleEmptyTexture;
        this.scaleTexture = scaleTexture;
        this.setDefaultY(5);
    }

    public EffectHud setDefaultY(int defaultY) {
        this.defaultY = defaultY;
        this.y = defaultY;
        return this;
    }

    public EffectHud setGraphics(GuiGraphics graphics) {
        this.graphics = graphics;
        return this;
    }

    public EffectHud setMinecraft(Minecraft mc) {
        this.mc = mc;
        return this;
    }

    public EffectHud setEffectData(EffectPlayerData effectData) {
        this.effectData = effectData;
        return this;
    }

    public void calculateAnimation() {
        if(effectData.duration > 0) {
            if(alpha < 1) {
                alpha = Math.min(1, alpha + 0.008);
            }
        } else if(effectData.timer <= effectData.timerMax / 5.5 && alpha > 0) {
            alpha = Math.max(0, alpha - 0.025);
        }
        scaleState = (int) (BORDER_TEXTURE_WIDTH * Math.min(1, (float) effectData.timer / effectData.timerMax));
    }

    public boolean isFull() {
        return effectData.duration > 0 && effectData.timer == effectData.timerMax;
    }

    public boolean isFilling() {
        return effectData.duration > 0 && effectData.timer < effectData.timerMax;
    }

    public boolean isUnfilling() {
        return effectData.duration == 0 && effectData.timer > 0;
    }

    public void onFilling() {}
    public void onUnfilling() {}
    public void onFull() {}
    public void onTick() {}
    public void onPreInit() {}
    public void onPostInit() {}
    public void onTerminate() {}

    public void drawBackground() {
        int screenWidth = mc.getWindow().getGuiScaledWidth();
        this.x = (screenWidth - BORDER_TEXTURE_WIDTH) / 2;
        graphics.blit(BORDER_TEXTURE, x, y, 0, 0, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT);
    }

    public void drawScale() {
        graphics.blit(scaleEmptyTexture, x, y, 0, 0, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT);
        graphics.blit(scaleTexture, x, y, 0, 0, scaleState, BORDER_TEXTURE_HEIGHT, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT);
    }

    public void drawLogIfNeed() {
        if(Config.EFFECT_DATA_LOGGING.get()) {
            graphics.drawString(mc.font, 
                Component.literal(effectData.duration + " of " + effectData.timer + ":" + effectData.timerMax)
                    .withStyle(style -> style.withFont(Author.ETHER.textFont())), 
                x + 93 + 5, y + 4, 0xFFFFFF, false);
        }
    }

    protected void invokeEvents() {
        if(isFull()) {
            onFull();
        }
        if(isFilling()) {
            onFilling();
        }
        if(isUnfilling()) {
            onUnfilling();
        }
    }

    public void preDraw() {}
    public void postDraw() {} 

    public void draw() {
        this.invokeEvents();
        this.calculateAnimation();
        this.preDraw();
        graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);
        this.drawBackground();
        this.drawScale();
        this.drawLogIfNeed();
        this.postDraw();
    }

    public EffectHud reset() {
        this.y = defaultY;
        this.scaleState = 0;
        this.alpha = 0;
        graphics = null;
        mc = null;
        effectData = null;
        preInited = false;
        terminated = false;
        return this;
    }
}
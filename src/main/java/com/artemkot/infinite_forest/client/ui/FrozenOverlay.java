package com.artemkot.infinite_forest.client.ui;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;

public class FrozenOverlay {
    public final ResourceLocation TEXTURE = ResourceLocation.withDefaultNamespace("textures/misc/powder_snow_outline.png");

    protected double alpha = 0;
    public boolean ahead = false;

    public void calculateAnimations() {
        if(ahead) {
            alpha = Math.min(1, alpha + 0.01);
        } else {
            alpha = Math.max(0, alpha - 0.01);
        }
    }

    public void draw(GuiGraphics graphics, Minecraft mc) {
        this.calculateAnimations();
        graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);

        int screenWidth = graphics.guiWidth();
        int screenHeight = graphics.guiHeight();

        graphics.blit(TEXTURE, 0, 0, 0, 0, screenWidth, screenHeight, screenWidth, screenHeight);
        graphics.setColor(1.0f, 1.0f, 1.0f, 1.0f);
    }

    public FrozenOverlay clear() {
        alpha = 0;
        return this;
    }
}

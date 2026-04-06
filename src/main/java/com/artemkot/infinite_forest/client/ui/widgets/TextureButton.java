package com.artemkot.infinite_forest.client.ui.widgets;

import com.artemkot.infinite_forest.InfiniteForest;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;

public class TextureButton extends Button {
    public static final ResourceLocation TOOLTIP_BORDER = ResourceLocation.fromNamespaceAndPath(InfiniteForest.MOD_ID, "textures/ui/tooltip_border.png"); 
    private final ResourceLocation normalTexture;
    private final ResourceLocation hoveredTexture;
    private final Component tooltip;
    
    public TextureButton(int x, int y, int width, int height,
                         ResourceLocation normalTexture, ResourceLocation hoveredTexture,
                         Component tooltip, OnPress onPress) {
        super(x, y, width, height, Component.empty(), onPress, DEFAULT_NARRATION);
        this.normalTexture = normalTexture;
        this.hoveredTexture = hoveredTexture;
        this.tooltip = tooltip;
    }
    
    @Override
    protected void renderWidget(GuiGraphics graphics, int mouseX, int mouseY, float partialTick) {
        graphics.blit(this.isHovered() ? hoveredTexture : normalTexture, this.getX(), this.getY(), 0, 0,
                    this.width, this.height, this.width, this.height);
        
      if (this.isHovered() && tooltip != null) {
            graphics.blit(
                TOOLTIP_BORDER,
                mouseX - 2, mouseY - 4,
                0, 0,
                width + 24, height + 4,
                16, 16
            );
        }
    }
}
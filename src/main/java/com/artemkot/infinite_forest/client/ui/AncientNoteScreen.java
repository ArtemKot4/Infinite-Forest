package com.artemkot.infinite_forest.client.ui;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.items.ancient_note.AncientNote;
import com.mojang.blaze3d.platform.GlStateManager;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.ChatFormatting;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;

@OnlyIn(Dist.CLIENT)
public class AncientNoteScreen extends Screen {
    private static final ResourceLocation BACKGROUND = 
        ResourceLocation.fromNamespaceAndPath(InfiniteForest.MOD_ID, "textures/ui/ancient_note.png");

    private static final int IMAGE_WIDTH = 136;
    private static final int IMAGE_HEIGHT = 179;
    
    private int leftPos;
    private int topPos;

    private final AncientNote.Page page;

    public AncientNoteScreen(AncientNote.Page page) {
        super(Component.translatable("item.infinite_forest.ancient_note"));
        this.page = page;
    }

    @Override
    protected void init() {
        super.init();
        this.leftPos = (this.width - IMAGE_WIDTH) / 2;
        this.topPos = (this.height - IMAGE_HEIGHT) / 2;
    }

    @Override
    public void render(GuiGraphics graphics, int mouseX, int mouseY, float partialTick) {
        this.renderBackground(graphics, mouseX, mouseY, partialTick);
        
        RenderSystem.enableBlend();
        RenderSystem.blendFunc(GlStateManager.SourceFactor.SRC_ALPHA,
            GlStateManager.DestFactor.ONE_MINUS_SRC_ALPHA);

        graphics.blit(BACKGROUND, leftPos, topPos, 0, 0, 
            IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_HEIGHT);
        
        RenderSystem.disableBlend();

        int textX = leftPos + 15;
        int textY = topPos + 40;
        int textWidth = IMAGE_WIDTH - 20;

        graphics.drawWordWrap(minecraft.font, 
            Component.translatable(page.name()).withStyle(style -> style.withFont(page.author().font())), 
            textX, topPos + 15, textWidth, ChatFormatting.DARK_GRAY.getColor());
        
        graphics.drawWordWrap(minecraft.font, 
            Component.translatable(page.description()).withStyle(style -> style.withFont(page.author().font())), 
            textX, textY, textWidth, ChatFormatting.DARK_GRAY.getColor());
    }

    @Override
    public boolean isPauseScreen() {
        return false;
    }
}
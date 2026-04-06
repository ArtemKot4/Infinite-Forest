package com.artemkot.infinite_forest.client.ui;

import java.util.concurrent.ThreadLocalRandom;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.client.ui.widgets.TextureButton;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote;
import com.mojang.blaze3d.platform.GlStateManager;
import com.mojang.blaze3d.systems.RenderSystem;

import net.minecraft.ChatFormatting;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.AbstractWidget;
import net.minecraft.client.gui.components.ImageButton;
import net.minecraft.client.gui.components.Button.OnPress;
import net.minecraft.client.gui.narration.NarratedElementType;
import net.minecraft.client.gui.narration.NarrationElementOutput;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.Style;
import net.minecraft.network.chat.TextColor;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;

@OnlyIn(Dist.CLIENT)
public class AncientNoteScreen extends Screen {
    TextureButton closeButton;

    private static final ResourceLocation EDIT = 
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "textures/ui/ancient_note/edit.png");
    
    private static final ResourceLocation EDIT_HOVER = 
    ResourceLocation.fromNamespaceAndPath("infinite_forest", "textures/ui/ancient_note/edit_hover.png");

    private static final int IMAGE_WIDTH = 136;
    private static final int IMAGE_HEIGHT = 179;
    
    private int leftPos;
    private int topPos;
    private final AncientNote.Page page;

    public AncientNoteScreen(AncientNote.Page page) {
        super(Component.translatable("item.infinite_forest.ancient_note"));
        this.page = page;
    }

    public class BackgroundWidget extends AbstractWidget {
        private static final ResourceLocation SKIP = 
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "textures/ui/ancient_note/skip.png");

        public AnimatedText animatedText; 

        private static final ResourceLocation BACKGROUND = 
        ResourceLocation.fromNamespaceAndPath("infinite_forest", "textures/ui/ancient_note/background.png");

        public BackgroundWidget() {
            super(10, 10, 100, 20, Component.empty());
            String description = Component.translatable(page.description()).getString();
            if(description == null) {
                description = "";
            }
            animatedText = new AnimatedText(description, page.author().textLineSize())
            .setTime(40)
            .setSpeed(0.3);
        
            this.active = true;
        }

        @Override
        protected void renderWidget(GuiGraphics graphics, int mouseX, int mouseY, float partialTick) {
            graphics.blit(BACKGROUND, leftPos, topPos, 0, 0, 
                        IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_HEIGHT);
            
            int textX = leftPos + 15;
            int textY = topPos + 40;
            int textWidth = IMAGE_WIDTH - 30;
            
            graphics.drawString(minecraft.font, 
                Component.translatable(page.name()).withStyle((style) -> style.withFont(page.author().textFont())), 
                textX, topPos + 20, ChatFormatting.DARK_GRAY.getColor(), false);
            
            // graphics.drawString(minecraft.font, 
            //     Component.literal(animatedText.text + this.getSpaces() + ".").withStyle((style) -> style.withFont(page.author().font())), 
            //     textX, textY, textWidth, ChatFormatting.DARK_GRAY.getColor());

            animatedText.draw(minecraft, graphics, textX, textY, 10, 
                style -> style.withFont(page.author().textFont())
                .withColor(ChatFormatting.DARK_GRAY.getColor()
            ));

            if(animatedText.isComplete()) {
                if(!closeButton.visible) {
                    closeButton.visible = true;
                }
            } else if(this.isMouseOver(mouseX, mouseY)) {
                graphics.blit(SKIP, mouseX - 5, mouseY - 5, 0, 0, 10, 10, 10, 10);
            }
        }

        @Override
        public boolean isMouseOver(double mouseX, double mouseY) {
            return mouseX >= leftPos && mouseX <= leftPos + IMAGE_WIDTH &&
                mouseY >= topPos && mouseY <= topPos + IMAGE_HEIGHT;
        }
        
        @Override
        protected void updateWidgetNarration(NarrationElementOutput output) {
            output.add(NarratedElementType.TITLE, getMessage());
        }

        @Override
        public boolean mouseClicked(double mouseX, double mouseY, int button) {
            animatedText.skip();
            return true;
        }
    }

    @Override
    protected void init() {
        super.init();
        this.leftPos = (this.width - IMAGE_WIDTH) / 2;
        this.topPos = (this.height - IMAGE_HEIGHT) / 2;

        closeButton = new TextureButton(
            leftPos + IMAGE_WIDTH - 15, topPos + 6, 10, 10,
            EDIT, EDIT_HOVER,
            Component.translatable("tooltip.infinite_forest.close"),
            button -> this.onClose()
        );
        
        this.addRenderableWidget(new BackgroundWidget());
        this.addRenderableWidget(closeButton);
        closeButton.visible = false;
    }

    @Override
    public boolean isPauseScreen() {
        return true;
    }
}
package com.artemkot.infinite_forest.client.ui;

import java.util.ArrayList;
import java.util.function.UnaryOperator;

import javax.annotation.Nullable;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.MutableComponent;
import net.minecraft.network.chat.Style;

public class AnimatedText {
    protected ArrayList<String> fullText;
    protected ArrayList<String> text;
    protected long lastUpdateTime = 0;
    protected double milliseconds = 50;
    protected double speed = 0;
    protected double speedContainer = 0;
    protected int lineIndex = 0;
    protected int fastModeChars = 1;
    
    public AnimatedText(String fullText, int lineSize) {
        this.fullText = DrawHelper.getArrayOfLines(fullText, lineSize);
        this.text = new ArrayList<>();

        for(int i = 0; i < this.fullText.size(); i++) {
            text.add("");
        }

        this.lastUpdateTime = System.currentTimeMillis();
    }

    public AnimatedText setTime(long milliseconds) {
        this.milliseconds = milliseconds;
        return this;
    }

    public AnimatedText setSpeed(double speed) {
        this.speed = speed;
        return this;
    }

    public void skip(int skipCharsCount) {
        fastModeChars = skipCharsCount; 
    }

    public void skip() {
        text = new ArrayList<>(fullText);
    }

    public void updateText() {
        long now = System.currentTimeMillis();
        boolean isTime = (now - lastUpdateTime) + speedContainer >= milliseconds;

        if(isTime) {
            for(int c = 0; c < fastModeChars && !isComplete(); c++) {
                if(text.get(lineIndex).length() < fullText.get(lineIndex).length()) {
                    text.set(lineIndex, text.get(lineIndex) + fullText.get(lineIndex).charAt(text.get(lineIndex).length()));
                } else if(lineIndex < fullText.size() - 1) {
                    lineIndex++;
                    c--;
                } else {
                    break;
                }
            }
            lastUpdateTime = now;
            speedContainer += speed;
        }
    }

    public void drawText(Minecraft minecraft, GuiGraphics graphics, int x, int y, int ySpace, @Nullable UnaryOperator<Style> styleFunc) {
        for(int i = 0; i < text.size(); i++) {
            MutableComponent lineComponent = Component.literal(text.get(i));
            if(styleFunc != null) {
                lineComponent.withStyle(styleFunc);
            }
            graphics.drawString(minecraft.font, lineComponent, x, y + i * ySpace, 0xFFFFFF, false);
        }
    }
    
    public void draw(Minecraft minecraft, GuiGraphics graphics, int x, int y, int ySpace, @Nullable UnaryOperator<Style> styleFunc) {
        if(!this.isComplete()) {
            this.updateText();
        }
        
        this.drawText(minecraft, graphics, x, y, ySpace, styleFunc);
    }
    
    public boolean isComplete() {
        return text.equals(fullText);
    }
}
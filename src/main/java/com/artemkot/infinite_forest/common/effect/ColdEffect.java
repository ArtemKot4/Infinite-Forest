package com.artemkot.infinite_forest.common.effect;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectType;
import com.artemkot.infinite_forest.client.ui.FrozenOverlay;

import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;

import com.artemkot.infinite_forest.api.effect.EffectHud;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;

public class ColdEffect extends EffectType {
    public final FrozenOverlay overlay = new FrozenOverlay();

    public final EffectHud HUD = new EffectHud(ModResources.getTextureUI("effect/winter_scale.png"), ModResources.getTextureUI("effect/winter_icon.png")) {
        public boolean drawOverlay = false;
        
        @Override
        public void onFull() {
            drawOverlay = true;
            overlay.ahead = true;
        }

        @Override
        public void onUnfilling() {
            overlay.ahead = false;
        }

        @Override
        public void onPostInit() {
            overlay.clear();
        }

        @Override
        public void onTerminate() {
            drawOverlay = false;
        }

        @Override 
        public void preDraw() {
            if(!drawOverlay) {
                return;
            }
            graphics.setColor(1.0f, 1.0f, 1.0f, 1.0f);
            overlay.draw(graphics, mc);
            graphics.setColor(1.0f, 1.0f, 1.0f, (float) alpha);
        }
    };

    public EffectHud getHud() {
        return HUD;
    }

    public String getStringID() {
        return "cold";
    }

    public void onFull(Player player, EffectPlayerData data) {
        Level level = player.level();
        if(level.getGameTime() % 10 == 0) {
            player.hurt(level.damageSources().magic(), 1);
        }
    }
}

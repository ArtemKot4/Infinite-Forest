package com.artemkot.infinite_forest.common.effect;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectType;
import com.artemkot.infinite_forest.client.ui.FrozenOverlay;

import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

import com.artemkot.infinite_forest.api.effect.EffectHud;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;

public class ColdEffect extends EffectType {
    public final FrozenOverlay overlay = new FrozenOverlay();

    public final EffectHud HUD = new EffectHud(ModResources.getTextureUI("effect/winter_scale_empty.png"), ModResources.getTextureUI("effect/winter_scale.png")) {
        @Override
        public void onUnfilling() {
            overlay.ahead = false;
        }

        @Override 
        public void preDraw() {
            if(!isFull() && !isUnfilling()) {
                overlay.clear();
                return;
            }
            overlay.draw(graphics, mc);
        }
    };

    public EffectHud getHud() {
        return HUD;
    }

    public void onFull(PlayerTickEvent.Post event, EffectPlayerData data) {
        Player player = event.getEntity();
        Level level = player.level();
        if(level.getGameTime() % 10 == 0) {
            player.hurt(level.damageSources().magic(), 1);
        }
    }
}

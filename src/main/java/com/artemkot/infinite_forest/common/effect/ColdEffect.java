package com.artemkot.infinite_forest.common.effect;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectType;

import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;

import com.artemkot.infinite_forest.api.effect.EffectHud;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;

public class ColdEffect extends EffectType {
    public final EffectHud HUD = new EffectHud(ModResources.getTextureUI("effect/winter_scale.png"), ModResources.getTextureUI("effect/winter_icon.png"));

    public EffectHud getHud() {
        return HUD;
    }

    public String getStringID() {
        return "cold";
    }

    public void onTick(Player player, EffectPlayerData data) {
        //player.sendSystemMessage(Component.literal("Холодный эффект действует!"));
    }
}

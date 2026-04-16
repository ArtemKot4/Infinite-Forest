package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.api.curse.Curse;

import net.minecraft.world.entity.player.Player;

public abstract class EffectType {
    protected Curse getCurse() {
        return null;
    }

    protected abstract EffectHud getHud();

    protected abstract String getStringID();

    public void onFull(Player player, EffectPlayerData data) {};
    public void onFilling(Player player, EffectPlayerData data) {};
    public void onUnfilling(Player player, EffectPlayerData data) {};
}
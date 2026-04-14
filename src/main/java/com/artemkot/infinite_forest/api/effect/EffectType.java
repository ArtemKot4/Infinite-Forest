package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.api.curse.Curse;

import net.minecraft.world.entity.player.Player;

public abstract class EffectType {
    protected Curse getCurse() {
        return null;
    }

    protected abstract EffectHud getHud();

    protected abstract String getStringID();

    public abstract void onTick(Player player, EffectPlayerData data);
}
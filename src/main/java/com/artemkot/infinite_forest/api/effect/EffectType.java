package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.api.curse.Curse;

import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public abstract class EffectType {
    protected Curse getCurse() {
        return null;
    }

    protected abstract EffectHud getHud();

    public void onFull(PlayerTickEvent.Post event, EffectPlayerData data) {};
    public void onFilling(PlayerTickEvent.Post event, EffectPlayerData data) {};
    public void onUnfilling(PlayerTickEvent.Post event, EffectPlayerData data) {};
}
package com.artemkot.infinite_forest.api.effect;

import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public abstract class EffectType {
    protected abstract EffectHud getHud();

    public void onFull(PlayerTickEvent.Post event, EffectPlayerData data) {};
    public void onFilling(PlayerTickEvent.Post event, EffectPlayerData data) {};
    public void onUnfilling(PlayerTickEvent.Post event, EffectPlayerData data) {};
}
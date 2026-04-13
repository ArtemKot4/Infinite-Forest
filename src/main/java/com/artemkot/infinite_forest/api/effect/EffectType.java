package com.artemkot.infinite_forest.api.effect;

import com.artemkot.infinite_forest.api.curse.Curse;

public abstract class EffectType {
    protected Curse getCurse() {
        return null;
    }

    protected abstract EffectHud getHud();

    protected abstract String getStringID();

    public abstract void onTick();
}
package com.artemkot.infinite_forest.common.effect;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectType;
import com.artemkot.infinite_forest.api.effect.EffectHud;

public class ColdEffect extends EffectType {
    public static final EffectHud HUD = new EffectHud(ModResources.getTextureUI("winter_scale"));

    public EffectHud getHud() {
        return HUD;
    }

    public String getStringID() {
        return "cold";
    }

    public void onTick() {
    
    }
}

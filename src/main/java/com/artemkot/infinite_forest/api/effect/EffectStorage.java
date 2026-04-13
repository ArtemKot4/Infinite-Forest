package com.artemkot.infinite_forest.api.effect;

import java.util.HashMap;

public class EffectStorage {
    protected static HashMap<String, EffectType> effects = new HashMap<>();
    protected static HashMap<String, EffectHud> huds = new HashMap<>();

    public static void addEffect(String id, EffectType effect, EffectHud hud) {
        effects.put(id, effect);
        huds.put(id, hud);
    }

    public static EffectType getEffect(String id) {
        return effects.get(id);
    }

    public static EffectHud getHud(String id) {
        return huds.get(id);
    }
}

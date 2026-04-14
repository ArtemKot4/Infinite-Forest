package com.artemkot.infinite_forest.api.effect;

import java.util.HashMap;

public class EffectStorage {
    protected static HashMap<String, EffectType> effects = new HashMap<>();

    public static void registerEffect(String id, EffectType effect) {
        effects.put(id, effect);
    }

    public static EffectType getEffect(String id) {
        return effects.get(id);
    }

    public static EffectHud getHud(String id) {
        return effects.get(id).getHud();
    }
}

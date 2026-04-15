package com.artemkot.infinite_forest.api.curse;

import java.util.HashMap;

public class CurseStorage {
    public static final HashMap<String, Curse> CURSES = new HashMap<>();

    public void registerCurse(String name, Curse curse) {
        CURSES.put(name, curse);
    }

    public Curse getCurse(String name) {
        return CURSES.get(name);
    }
}

package com.artemkot.infinite_forest.api.curse;

import java.util.HashMap;

public class CurseStorage {
    public static final HashMap<String, Curse> CURSES = new HashMap<>();

    public static void registerCurse(String name, Curse curse) {
        CURSES.put(name, curse);
    }

    public static <T extends Curse> T getCurse(String name) {
        return (T) CURSES.get(name);
    }
}

package com.artemkot.infinite_forest.api.curse;

import java.util.HashSet;
import java.util.Set;

public class ClientCurseData {
    private static Set<String> activeCurses = new HashSet<>();

    public static void addCurse(String curse) {
        activeCurses.add(curse);
    }

    public static void removeCurse(String curse) {
        activeCurses.remove(curse);
    }

    public static void setCurses(Set<String> curses) {
        activeCurses = curses;
    }

    public static boolean hasCurse(String curse) {
        return activeCurses.contains(curse);
    }

    public static Set<String> getActiveCurses() {
        return activeCurses;
    }
}

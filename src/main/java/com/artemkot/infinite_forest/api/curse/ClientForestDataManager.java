package com.artemkot.infinite_forest.api.curse;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class ClientForestDataManager {
    private static final Set<String> activeCurses = new HashSet<>();
    private static final Set<String> foundAncientNotes = new HashSet<>();

    public static void addCurse(String curse) {
        activeCurses.add(curse);
    }

    public static void removeCurse(String curse) {
        activeCurses.remove(curse);
    }

    public static void setCurses(Set<String> curses) {
        activeCurses.clear();
        activeCurses.addAll(curses);
    }

    public static boolean hasCurse(String curse) {
        return activeCurses.contains(curse);
    }

    public static Set<String> getActiveCurses() {
        return Collections.unmodifiableSet(activeCurses);
    }

    public static void addFoundAncientNote(String note) {
        foundAncientNotes.add(note);
    }

    public static void removeFoundAncientNote(String note) {
        foundAncientNotes.remove(note);
    }

    public static void setFoundAncientNotes(Set<String> notes) {
        foundAncientNotes.clear();
        foundAncientNotes.addAll(notes);
    }

    public static boolean hasFoundAncientNote(String note) {
        return foundAncientNotes.contains(note);
    }

    public static Set<String> getFoundAncientNotes() {
        return Collections.unmodifiableSet(foundAncientNotes);
    }

    public static void clear() {
        activeCurses.clear();
        foundAncientNotes.clear();
    }
}
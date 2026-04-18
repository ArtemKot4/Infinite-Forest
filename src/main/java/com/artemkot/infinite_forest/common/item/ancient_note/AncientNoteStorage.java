package com.artemkot.infinite_forest.common.item.ancient_note;

import java.util.HashMap;

import javax.annotation.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.data_components.AncientNotePage;
import com.artemkot.infinite_forest.common.item.data_components.Author;
import com.artemkot.infinite_forest.common.world.ForestDataManager;

import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;

public class AncientNoteStorage {
    public static HashMap<String, AncientNotePage> container = new HashMap<>();

    public static void addNote(String stringId, AncientNotePage page) {
        container.put(stringId, page);
    }

    public static void addNote(String stringId, @NonNull Author author, @NonNull String name, @NonNull String description, @Nullable String learning) {
        if(name == null) {
            name = "ancient_note.infinite_forest." + stringId + ":name";
        }
        if(description == null) {
            description = "ancient_note.infinite_forest." + stringId + ":description";
        }
        if(Component.translatable(name).getString().equals(name)) {
            name = "";
        }
  
        addNote(stringId, new AncientNotePage(stringId,author, name, description, learning));    
    }

    public static @Nullable AncientNotePage findFree() {
        for(String ancientNoteId : AncientNoteStorage.container.keySet()) {
            if(!ForestDataManager.isFoundAncientNote(ancientNoteId)) {
                return AncientNoteStorage.getPage(ancientNoteId);
            }
        }
        return null;
    }

    public static void addNote(String stringId, Author author, @Nullable String learning) {
        addNote(stringId, author, null, null, learning);
    }

    public static void addNote(String stringId, Author author) {
        addNote(stringId, author, "");
    }

    public static @Nullable AncientNotePage getPage(String stringId) {
        return container.get(stringId);
    }

    static {
        addNote("flames", Author.ETHER);
        addNote("moon_flower", Author.ARCHIEBALD);
        addNote("welcome", Author.INFINITE_FOREST);
        //addNote("roots_blame");
    }
}

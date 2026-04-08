package com.artemkot.infinite_forest.common.item.ancient_note;

import java.util.HashMap;

import javax.annotation.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote.Author;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote.Page;
import com.artemkot.infinite_forest.common.item.data_components.AncientNoteData;

import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;

public class AncientNoteStorage {
    public static HashMap<String, Page> container = new HashMap<>();

    public static Page getPageFrom(ItemStack stack, @Nullable Player player) {
        AncientNoteData data = stack.get(DataComponentList.ANCIENT_NOTE_DATA);
        String stringId = data.stringId();

        if(!stringId.equals("custom")) {
            @Nullable Page page = getNote(stringId);
            return page == null ? Page.ERROR : page;
        }
        String authorName = "";

        if(player != null) {
            authorName = player.getDisplayName().getString();
        }

        Author author = Author.PLAYER.copyWith(authorName);
        String name = data.name();
        String description = data.description();
        String learning = data.learning();

        return new Page(author, name, description, learning);
    }

    public static void addNote(String stringId, Page page) {
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
  
        addNote(stringId, new Page(author, name, description, learning));    
    }

    public static void addNote(String stringId, Author author, @Nullable String learning) {
        addNote(stringId, author, null, null, learning);
    }

    public static void addNote(String stringId, Author author) {
        addNote(stringId, author, "");
    }

    public static @Nullable Page getNote(String stringId) {
        return container.get(stringId);
    }

    static {
        addNote("flames", Author.ETHER);
        addNote("moon_flower", Author.SCIENTIST);
        addNote("welcome", AncientNote.Author.INFINITE_FOREST);
        //addNote("roots_blame");
    }
}

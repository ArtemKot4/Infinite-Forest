package com.artemkot.infinite_forest.items.ancient_note;

import java.util.HashMap;

import javax.annotation.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

import com.artemkot.infinite_forest.DataComponentList;
import com.artemkot.infinite_forest.items.ancient_note.AncientNote.Author;
import com.artemkot.infinite_forest.items.ancient_note.AncientNote.Page;
import com.artemkot.infinite_forest.items.data_components.AncientNoteData;

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
        addNote(stringId, new Page(author, name, description, learning));    
    }

    public static void addNote(Page page) {
        addNote(page.name(), page);
    }

    public static @Nullable Page getNote(String stringId) {
        return container.get(stringId);
    }

    static {
        addNote("flames", new Page(Author.ETHER, "ancient_note.infinite_forest.flames_name", "ancient_note.infinite_forest.flames_description", null));
        addNote("moon_flower", new Page(Author.SCIENTIST, "ancient_note.infinite_forest.moon_flower_name", "ancient_note.infinite_forest.moon_flower_description", null));
    }
}

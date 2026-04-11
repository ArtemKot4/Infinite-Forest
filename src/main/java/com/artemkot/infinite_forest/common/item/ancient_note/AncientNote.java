package com.artemkot.infinite_forest.common.item.ancient_note;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

import com.artemkot.infinite_forest.InfiniteForest;
import com.artemkot.infinite_forest.client.ui.AncientNoteScreen;
import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.data_components.AncientNoteData;

import net.minecraft.ChatFormatting;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;

public class AncientNote extends Item {
    public AncientNote() {
        super(new Item.Properties().stacksTo(1).component(DataComponentList.ANCIENT_NOTE_DATA, AncientNoteData.EMPTY));
    }

    public record Author(@Nonnull String name, @Nonnull ResourceLocation textFont, @NonNull int textLineSize) {
        public static Author PLAYER = new Author("", InfiniteForest.getResourceLocation("player"), 16);
        public static Author ETHER = new Author("name.infinite_forest.ether", InfiniteForest.getResourceLocation("ancient_note_ether"), 16);
        public static Author SCIENTIST = new Author("name.infinite_forest.scientist", InfiniteForest.getResourceLocation("ancient_note_scientist"), 25);
        public static Author INFINITE_FOREST = new Author("name.infinite_forest.infinite_forest", InfiniteForest.getResourceLocation("infinite_forest"), 19);
        
        public Author copyWith(String newName) {
            return new Author(newName, textFont, textLineSize);
        }
    }

    public record Page(@NonNull Author author, @NonNull String name, @NonNull String description, @Nullable String learning) {
        public Page {
            if(learning == null) {
                learning = "";
            }
        }

        public Page(@NonNull Author author) {
            this(author, "", "", "");
        }

        public static Page ERROR = new Page(Author.ETHER, "Error with loading", "Guess, you got error. Please send bug report", null);
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand usedHand) {
        ItemStack stack = player.getItemInHand(usedHand);

        if (level.isClientSide) {
            AncientNoteData data = stack.get(DataComponentList.ANCIENT_NOTE_DATA);
            if (data != null) {
                Minecraft.getInstance().setScreen(new AncientNoteScreen(AncientNoteStorage.getPageFrom(stack, player)));
            }
        }

        return InteractionResultHolder.success(stack);
    }

    @Override
    public void appendHoverText(ItemStack stack, TooltipContext context, List<Component> tooltipComponents,
            TooltipFlag tooltipFlag) {        
        Page page = AncientNoteStorage.getPageFrom(stack, null);
        String name = page.name().trim();
        String authorName = page.author().name().trim();

        if(name == "") {
            name = "note.infinite_forest.empty";
        }
        if(authorName == "") {
            authorName = "message.infinite_forest.unknown";
        }

        tooltipComponents.add((Component.literal("§6" + Component.translatable(authorName).getString() + "§f: §7" + Component.translatable(name).getString())));

        if(page.learning() != null && !page.learning().trim().equals("")) {
            tooltipComponents.add(Component.translatable("learning.infinite_forest." + page.learning())
            .withStyle(ChatFormatting.GOLD));
        }
    }
}

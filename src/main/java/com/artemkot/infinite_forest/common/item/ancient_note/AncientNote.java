package com.artemkot.infinite_forest.common.item.ancient_note;

import java.util.List;

import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.data_components.AncientNotePage;
import com.artemkot.infinite_forest.network.packets.OpenAncientNoteScreenPacket;

import net.minecraft.ChatFormatting;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;
import net.neoforged.neoforge.network.PacketDistributor;

public class AncientNote extends Item {
    public AncientNote() {
        super(new Item.Properties().stacksTo(1).component(DataComponentList.ANCIENT_NOTE_DATA, AncientNotePage.EMPTY));
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand usedHand) {
        ItemStack stack = player.getItemInHand(usedHand);

        if(level.isClientSide()) {
            return InteractionResultHolder.success(stack);
        }
        AncientNotePage page = stack.get(DataComponentList.ANCIENT_NOTE_DATA);
        if(page.isUnknown()) {
            AncientNotePage foundPage = AncientNoteStorage.findFree();
            if(foundPage == null) {
                foundPage = AncientNotePage.CUSTOM;
            }
            page = foundPage;
        }
        stack.set(DataComponentList.ANCIENT_NOTE_DATA, page);
        player.setItemInHand(usedHand, stack);
        PacketDistributor.sendToPlayer((ServerPlayer) player, new OpenAncientNoteScreenPacket(page));

        return InteractionResultHolder.success(stack);
    }

    @Override
    public void appendHoverText(ItemStack stack, TooltipContext context, List<Component> tooltipComponents,
            TooltipFlag tooltipFlag) {        
        AncientNotePage page = stack.get(DataComponentList.ANCIENT_NOTE_DATA);
        String name = page.name().trim();
        String authorName = page.author().name().trim();
        String ancientNoteId = page.stringId();

        if(ancientNoteId.equals("unknown")) {
            authorName = "";
            name = "message.infinite_forest.unknown_ancient_note";
        } else {
            if(name == "") {
                name = "message.infinite_forest.no_name";
            }
            if(authorName == "") {
                authorName = "message.infinite_forest.unknown";
            }
        }
        tooltipComponents.add((Component.literal("§6" + (authorName.equals("") ? "" : Component.translatable(authorName).getString() + "§f: ") + "§7" + Component.translatable(name).getString())));

        if(page.learning() != null && !page.learning().trim().equals("")) {
            tooltipComponents.add(Component.translatable("learning.infinite_forest." + page.learning())
            .withStyle(ChatFormatting.GOLD));
        }
    }
}

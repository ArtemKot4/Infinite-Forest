package com.artemkot.infinite_forest.items;

import java.util.List;

import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;

public class TransferCrystal extends Item {
    public final int dimension;

    public TransferCrystal(int dimension) {
        super(new Item.Properties().stacksTo(1));
        this.dimension = dimension;
    }

    @Override
    public void appendHoverText(ItemStack stack, TooltipContext context, 
                                List<Component> tooltip, TooltipFlag flag) {
        tooltip.add(Component.translatable("tooltip.infinite_forest." + BuiltInRegistries.ITEM.getKey(this).getPath()));
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
        if (level.isClientSide) {
            player.displayClientMessage(Component.literal("§7Тест. Телепортация в измерение " + dimension), true);
        }
        return InteractionResultHolder.success(player.getItemInHand(hand));
    }
}

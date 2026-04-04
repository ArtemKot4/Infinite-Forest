package com.artemkot.infinite_forest.items;

import java.util.List;

import net.minecraft.ChatFormatting;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;

public class TransferCrystal extends Item {
    private final ResourceKey<Level> targetDimension;
    
    public TransferCrystal(ResourceKey<Level> targetDimension) {
        super(new Item.Properties().stacksTo(1).fireResistant());
        this.targetDimension = targetDimension;
    }
    
    @Override
    public void appendHoverText(ItemStack stack, TooltipContext context, List<Component> tooltip, TooltipFlag flag) {
        tooltip.add(Component.translatable("tooltip.infinite_forest." + 
            BuiltInRegistries.ITEM.getKey(this).getPath())
            .withStyle(ChatFormatting.GRAY)
        );
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand usedHand) {
        ItemStack stack = player.getItemInHand(usedHand);
        
        if (!level.isClientSide) {
            ServerPlayer serverPlayer = (ServerPlayer) player;
            ServerLevel targetDimension = serverPlayer.server.getLevel(this.targetDimension);
            
            if (targetDimension != null) {
                serverPlayer.teleportTo(targetDimension, serverPlayer.getX(), serverPlayer.getY(), serverPlayer.getZ(), serverPlayer.getYRot(), serverPlayer.getXRot());
            }
        }
        
        return InteractionResultHolder.success(stack);
    }
}
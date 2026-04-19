package com.artemkot.infinite_forest.common.effect;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectHud;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectType;
import com.artemkot.infinite_forest.common.item.ancient_note.AncientNote;
import com.artemkot.infinite_forest.common.item.data_components.Author;

import net.minecraft.ChatFormatting;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.minecraft.network.protocol.game.ClientboundSetCarriedItemPacket;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.EquipmentSlot;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class FearEffect extends EffectType {
    public final EffectHud HUD = new EffectHud(ModResources.getTextureUI("effect/fear_scale_empty.png"), ModResources.getTextureUI("effect/fear_scale.png")) {
        private int fearOffset = 0;

        @Override
        public void drawScale() {
            if(Minecraft.getInstance().level.getGameTime() % 5 == 0) {
                fearOffset = ThreadLocalRandom.current().nextInt(10);
            }
            graphics.blit(BORDER_TEXTURE, x, y, 0, 0, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT);
            graphics.blit(scaleTexture, x, y, 0, 0, Math.max(0, scaleState - fearOffset), BORDER_TEXTURE_HEIGHT, BORDER_TEXTURE_WIDTH, BORDER_TEXTURE_HEIGHT);
        }

        public void onPostInit() {
            Minecraft.getInstance().gui.getChat().addMessage(Component.translatable("message.infinite_forest.fear").withStyle(style -> style.withFont(Author.ETHER.textFont()).withColor(ChatFormatting.GRAY.getColor())));
        }
    };

    @Override
    protected EffectHud getHud() {
        return HUD;
    }
    
    @Override
    public void onFull(PlayerTickEvent.Post event, EffectPlayerData data) {
        Player player = event.getEntity();
        if(player.level().getGameTime() % 5 == 0) {
            int newSlot = ThreadLocalRandom.current().nextInt(9);
            player.getInventory().selected = newSlot;
            
            if(player instanceof ServerPlayer serverPlayer) {
                serverPlayer.connection.send(new ClientboundSetCarriedItemPacket(newSlot));
            }
        }
    }
}
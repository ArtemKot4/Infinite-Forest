package com.artemkot.infinite_forest.api.effect;

import java.util.Iterator;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;

import net.minecraft.client.renderer.EffectInstance;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class EffectTickEvents {
    public static void tick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(player.level().isClientSide() || (player.isCreative() || player.isSpectator())) {
            return;
        }
        EffectManager storage = player.getData(AttachmentList.PLAYER_EFFECTS.get());
        
        if(storage == null) {
            return;
        }
        Iterator<EffectPlayerData> iterator = storage.getActiveEffects().iterator();

        while(iterator.hasNext()) {
            EffectPlayerData effectData = iterator.next();
            EffectType effect = EffectStorage.getEffect(effectData.id);
            boolean removed = false;

            if(effectData.duration > 0) {
                if(effectData.timer < effectData.timerMax) {
                    effect.onFilling(event, effectData);
                    effectData.timer++;
                } else {
                    effectData.duration--;
                    effect.onFull(event, effectData);
                }
            } else {
                if(effectData.timer > 0) {
                    effect.onUnfilling(event, effectData);
                    effectData.timer--;
                } else {
                    iterator.remove();
                    removed = true;
                }
            }
        }
        player.setData(AttachmentList.PLAYER_EFFECTS.get(), storage);
    }
}
package com.artemkot.infinite_forest.api.effect;

import java.util.Iterator;

import com.artemkot.infinite_forest.AttachmentList;
import com.artemkot.infinite_forest.InfiniteForest;

import net.minecraft.client.renderer.EffectInstance;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

@EventBusSubscriber(modid = InfiniteForest.MOD_ID)
public class TickEvents {
    @SubscribeEvent
    public static void onPlayerTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(player.level().isClientSide()) {
            return;
        }
        PlayerEffectStorage storage = player.getData(AttachmentList.PLAYER_EFFECTS.get());
        
        if(storage == null) {
            return;
        }
        Iterator<EffectPlayerData> iterator = storage.getActiveEffects().iterator();

        while(iterator.hasNext()) {
            EffectPlayerData effectData = iterator.next();
            EffectType effect = EffectStorage.getEffect(effectData.id);

            if(effectData.duration > 0) {
                if(effectData.timer < effectData.timerMax) {
                    effectData.timer++;
                } else {
                    effectData.duration--;
                    if(effect != null) {
                        effect.onTick(player, effectData);
                    }
                }
            } else {
                if(effectData.timer > 0) {
                    effectData.timer--;
                } else {
                    iterator.remove();
                }
            }
        }
        player.setData(AttachmentList.PLAYER_EFFECTS.get(), storage);
    }
}
package com.artemkot.infinite_forest.api.effect;

import java.util.Iterator;

import com.artemkot.infinite_forest.AttachmentList;
import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class EffectTickEvents {
    public static void tick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(player.level().isClientSide || (player.isCreative() || player.isSpectator())) {
            return;
        }
        EffectManager storage = player.getData(AttachmentList.PLAYER_EFFECTS);
        
        if(storage == null) {
            return;
        }
        Iterator<EffectPlayerData> iterator = storage.getActiveEffects().iterator();

        while(iterator.hasNext()) {
            EffectPlayerData effectData = iterator.next();
            EffectType effect = EffectStorage.getEffect(effectData.id);

            if(effectData.duration > 0) {
                if(effectData.timer < effectData.timerMax) {
                    effect.onFilling(event, effectData);
                    effectData.timer = Math.min(effectData.timerMax, effectData.timer + 1);
                } else {
                    effectData.duration = Math.max(0, effectData.duration - 1);
                    effect.onFull(event, effectData);
                }
            } else {
                if(effectData.timer > 0) {
                    effect.onUnfilling(event, effectData);
                    effectData.timer = Math.max(0, effectData.timer - 1);
                } else {
                    iterator.remove();
                }
            }
        }
        player.setData(AttachmentList.PLAYER_EFFECTS, storage);
    }
}
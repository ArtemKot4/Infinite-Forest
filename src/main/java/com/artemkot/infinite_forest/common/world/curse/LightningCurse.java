package com.artemkot.infinite_forest.common.world.curse;

import com.artemkot.infinite_forest.api.curse.Curse;
import com.artemkot.infinite_forest.api.effect.EffectManager;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;

import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent.Post;

public class LightningCurse extends Curse {
    public final int fearY = 30;
    
    @Override
    public void onServerTick(Post event) {
        Player player = event.getEntity();
        if(player.getY() <= fearY) {
            EffectManager.addEffect(player, new EffectPlayerData("fear"));
        }
    }
}

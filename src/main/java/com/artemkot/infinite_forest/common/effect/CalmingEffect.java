package com.artemkot.infinite_forest.common.effect;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.effect.EffectHud;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectType;
import com.artemkot.infinite_forest.common.item.data_components.Author;

import net.minecraft.client.Minecraft;
import net.minecraft.network.protocol.game.ClientboundSetCarriedItemPacket;
import net.minecraft.server.level.ServerPlayer;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class CalmingEffect extends EffectType {
    public final EffectHud HUD = new EffectHud(ModResources.getTextureUI("effect/calming_scale_empty.png"), ModResources.getTextureUI("effect/calming_scale.png")) {};

    @Override
    protected EffectHud getHud() {
        return HUD;
    }
    
    @Override
    public void onFull(PlayerTickEvent.Post event, EffectPlayerData data) {}
}

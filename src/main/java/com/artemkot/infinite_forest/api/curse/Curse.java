package com.artemkot.infinite_forest.api.curse;

import net.minecraft.world.entity.player.Player;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class Curse {
    public void onServerTick(PlayerTickEvent.Post event) {}
    public void onClientTick(PlayerTickEvent.Post event) {}

    public boolean everywhere() {
        return false;
    }
}

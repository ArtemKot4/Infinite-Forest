package com.artemkot.infinite_forest.common.world.curse;

import java.util.HashSet;

import com.artemkot.infinite_forest.api.curse.Curse;

import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.block.Block;

public class ColdCurse extends Curse {
    public HashSet<Block> frozenBlocks = new HashSet();

    public void onTick(Player player) {
        
    }

    public void addFrozenBlock(Block block) {
        frozenBlocks.add(block);
    }

    public boolean isFrozenBlock(Block block) {
        return frozenBlocks.contains(block);
    }
}

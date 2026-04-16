package com.artemkot.infinite_forest.common.world.curse;

import java.util.HashSet;
import java.util.Set;

import com.artemkot.infinite_forest.api.curse.Curse;
import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.api.effect.EffectPlayerData;
import com.artemkot.infinite_forest.api.effect.EffectManager;
import com.artemkot.infinite_forest.common.world.WorldDataHandler;

import net.minecraft.ChatFormatting;
import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.network.chat.Component;
import net.minecraft.util.RandomSource;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;

public class ColdCurse extends Curse {
    public final Set<Player> skyGuests = new HashSet();
    public final int skyPosition = 350;
    public final HashSet<Block> cursedBlocks = new HashSet();

    public void runSnowInRadius(Level level, double x, double y, double z, int radius, int count, int height) {
        if(level.getGameTime() % 8 == 0) {
            for(int i = 0; i < height; i += 2) {
                RandomSource random = level.getRandom();
                
                for(int n = -count; n <= count; n++) {
                    level.addParticle(
                        ParticleTypes.SNOWFLAKE,
                        x + n, y + i, z + random.nextInt(radius * 2 + 1) - radius,
                        0.05, -0.1, 0
                    );
                    level.addParticle(
                        ParticleTypes.SNOWFLAKE,
                        x + random.nextInt(radius * 2 + 1) - radius, y + i, z + n,
                        0.05, -0.1, 0
                    );
                }
            }
        }
    }

    public boolean isSkyPosition(double y) {
        return y > skyPosition;
    }

    @Override
    public void onServerTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(isSkyPosition(player.getY())) {
            if(!skyGuests.contains(player)) {
                player.sendSystemMessage(Component.translatable("message.infinite_forest.cold").withColor(ChatFormatting.BLUE.getColor()));
            }
            skyGuests.add(player);
            EffectManager.addEffect(player, new EffectPlayerData("cold", 500, 30));
        } else if(skyGuests.contains(player)) {
            EffectManager.setDuration(player, "cold", 0);
            skyGuests.remove(player);
        }
    }

    @Override
    public void onClientTick(PlayerTickEvent.Post event) {
        Player player = event.getEntity();

        if(player.getY() >= skyPosition - 30 && player.getY() < skyPosition) {
            runSnowInRadius(player.level(), player.getX(), skyPosition, player.getZ(), 128, 128, 5);
        }
        if(isSkyPosition(player.getY())) {
            runSnowInRadius(player.level(), player.getX(), player.getY(), player.getZ(), 16, 128, 20);
        }
    }

    public void adCursedBlock(Block block) {
        cursedBlocks.add(block);
    }

    public boolean isCursedBlock(Block block) {
        return cursedBlocks.contains(block);
    }

    public void leftClickBlock(PlayerInteractEvent.LeftClickBlock event) {
        Player player = event.getEntity();
        Level level = player.level();
        BlockPos pos = event.getPos();
        BlockState state = level.getBlockState(pos);

        if(!WorldDataHandler.hasCurse(level, "cold")) {
            return;
        }
        if(!CurseStorage.<ColdCurse>getCurse("cold").isCursedBlock(state.getBlock())) {
            return;
        }
        event.setCanceled(true);

        if(!level.isClientSide) {
            EffectManager.addEffect(player, new EffectPlayerData("cold", 10, 50));
        }
    }
}

package com.artemkot.infinite_forest.world.sky;

import com.artemkot.infinite_forest.InfiniteForest;

import net.minecraft.client.Camera;
import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;
import net.neoforged.neoforge.client.event.RegisterDimensionSpecialEffectsEvent;

@OnlyIn(Dist.CLIENT)
public class ForestSkyEffects extends net.minecraft.client.renderer.DimensionSpecialEffects {
    
    public static final ResourceLocation FOREST_SKY = 
        ResourceLocation.fromNamespaceAndPath(InfiniteForest.MOD_ID, "sky");
    
    private static final net.minecraft.world.phys.Vec3 SKY_COLOR = 
        new net.minecraft.world.phys.Vec3(0.05, 0.2, 0.3);     
    private static final net.minecraft.world.phys.Vec3 FOG_COLOR = 
        new net.minecraft.world.phys.Vec3(0, 0.6, 0.3);
    
    public ForestSkyEffects() {
        super(192.0F, true, SkyType.NORMAL, false, false);
    }
    
    @Override
    public net.minecraft.world.phys.Vec3 getBrightnessDependentFogColor(
            net.minecraft.world.phys.Vec3 biomeFogColor, float daylight) {
        return FOG_COLOR;
    }

    @Override
    public boolean isFoggyAt(int x, int y) {
        return false;
    }
    
    @Override
    public boolean renderSky(ClientLevel level, int ticks, float partialTick, 
                             org.joml.Matrix4f modelViewMatrix, Camera camera, 
                             org.joml.Matrix4f projectionMatrix, boolean isFoggy, 
                             Runnable setupFog) {
        return false;
    }
    
    public static void register(RegisterDimensionSpecialEffectsEvent event) {
        event.register(FOREST_SKY, new ForestSkyEffects());
    }
}
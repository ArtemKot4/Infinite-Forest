package com.artemkot.infinite_forest;

import net.minecraft.resources.ResourceLocation;

public class ModResources {
    public static ResourceLocation getResourceLocation(String name) {
        return ResourceLocation.fromNamespaceAndPath(InfiniteForest.MOD_ID, name);
    }

    public static ResourceLocation getTexture(String name) {
        return getResourceLocation("textures/" + name);
    }

    public static ResourceLocation getTextureUI(String name) {
        return getTexture("ui/" + name);
    }
}

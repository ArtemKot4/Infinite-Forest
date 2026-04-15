package com.artemkot.infinite_forest;

import net.neoforged.neoforge.common.ModConfigSpec;

public class Config {
    private static final ModConfigSpec.Builder BUILDER = new ModConfigSpec.Builder();

    public static final ModConfigSpec.BooleanValue DEVELOPMENT_MODE = BUILDER
            .comment("Development mode")
            .define("Add ancient notes to creative. Not recommended for default players", true);

    public static final ModConfigSpec.BooleanValue EFFECT_DATA_LOGGING = BUILDER
            .comment("Log of effect data near with scale overlay. Useful for debugging.")
            .define("logging", false);
            
    public static final ModConfigSpec SPEC = BUILDER.build();
}

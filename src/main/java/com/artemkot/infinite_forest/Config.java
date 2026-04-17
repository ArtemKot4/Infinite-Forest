package com.artemkot.infinite_forest;

import net.neoforged.neoforge.common.ModConfigSpec;

public class Config {
    private static final ModConfigSpec.Builder BUILDER = new ModConfigSpec.Builder();
    
    public static final ModConfigSpec.ConfigValue<Integer> COLD_CURSE_SKY_HEIGHT;
    public static final ModConfigSpec.ConfigValue<Integer> COLD_CURSE_SNOW_PARTICLES;
    
    static {
        BUILDER.push("curses");
        BUILDER.push("cold");
        
        COLD_CURSE_SKY_HEIGHT = BUILDER
                .comment("Высота неба для активации проклятия")
                .defineInRange("высота_неба", 500, 0, 1000);
        
        COLD_CURSE_SNOW_PARTICLES = BUILDER
                .comment("Количество частиц снега")
                .defineInRange("количество_частиц_снега", 128, 0, 500);
        
        BUILDER.pop(2);
    }
    
    public static final ModConfigSpec.BooleanValue DEVELOPMENT_MODE = BUILDER
            .comment("Development mode - добавлять древние записки в креатив")
            .define("development_mode", true);
    
    public static final ModConfigSpec.BooleanValue EFFECT_DATA_LOGGING = BUILDER
            .comment("Логирование данных эффектов для отладки")
            .define("effect_data_logging", false);
    
    public static final ModConfigSpec SPEC = BUILDER.build();
}
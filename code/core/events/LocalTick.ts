Callback.addCallback("LocalTick", () => {
  if (Player.getDimension() !== InfiniteForest.id) {
    return;
  };

  const pos = Player.getPosition();
  const region = BlockSource.getCurrentClientRegion();
  const biome = region.getBiome(pos.x, pos.z);
  const params = BiomeForest.data[biome];

  if(!params) {
    return;
  };

  if (World.getThreadTime() % 120 === 0) {

  Game.message(JSON.stringify(params));

    if(pos.y >= 110) {
        NativeAPI.setSkyColor(170/256, 170/256, 170/256);
        NativeAPI.setFogColor(100/256, 100/256, 100/256);
        return;
    }

    const runtime = params.runtime;

    if(runtime?.cloud) {
        NativeAPI.setCloudColor(runtime.sky.r/256, runtime.sky.g/256, runtime.sky.b/256);
    } else {
        NativeAPI.resetCloudColor();
    };

    if(runtime?.fog) {
        NativeAPI.setFogColor(runtime.fog.r/256, runtime.fog.g/256, runtime.fog.b/256);
    } else {
        NativeAPI.resetFogColor();
    };

    if(runtime?.sky) {
        NativeAPI.setSkyColor(runtime.sky.r/256, runtime.sky.g/256, runtime.sky.b/256)
    } else {
        NativeAPI.resetSkyColor();
    };
    
  };

  if(World.getThreadTime() % 30 == 0 && params.events && params.events.onTick) {
       return params.events.onTick(Player.getLocal(), region, pos.x, pos.y, pos.z);
  };

});

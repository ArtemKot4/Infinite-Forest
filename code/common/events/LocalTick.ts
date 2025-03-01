Callback.addCallback("LocalTick", () => {
    if (Player.getDimension() !== EDimension.INFINITE_FOREST.id) {
        return;
    };

    const pos = Player.getPosition();
    const region = BlockSource.getCurrentClientRegion();
    const biome = region.getBiome(pos.x, pos.z);
    const params = AbstractBiome.data[biome] as AbstractBiome & BiomeBehaviour;

    if(!params) {
        return;
    };

    const time = World.getThreadTime();

    if (time % 120 === 0) {

    };

    if(params.getLocalUpdate && time % params.getLocalUpdate() == 0 && params.insideLocalTick) {
        return params.insideLocalTick(pos, time);
    };

});


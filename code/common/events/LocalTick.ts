Callback.addCallback("LocalTick", () => {
    const time = World.getThreadTime();
    if(time % 20 == 0) {
        TileSignRenderer.renderByPointed();
    }

    if(Player.getDimension() != DimensionList.INFINITE_FOREST.id) {
        return;
    }
    const pos = Player.getPosition();
    const region = BlockSource.getCurrentClientRegion();
    const biome = region.getBiome(pos.x, pos.z);
    const params = AbstractForestBiome.data[biome] as AbstractForestBiome & BiomeBehaviour;

    if(!params) {
        return;
    }

    // if(time % 120 === 0) {
        
    // }

    

    if(params.getLocalUpdate && time % params.getLocalUpdate() == 0 && params.insideLocalTick) {
        params.insideLocalTick(pos, time);
    }
    return;
});


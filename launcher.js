ConfigureMultiplayer({
    isClientOnly: false
});

IMPORT("DependenceHelper");
new Dependence(__name__)
    .addDependence("DungeonUtility", "https://icmods.mineprogramming.org/mod?id=783")
    .addDependence("InfiniteDepth",  "https://icmods.mineprogramming.org/mod?id=940")
    .setLaunch(function(all_api, api){
        Launch(api);
    });
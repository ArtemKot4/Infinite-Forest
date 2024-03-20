const InfiniteTick = function () {
    return {
    moon: green_moon.model(),
    update(): void {
        if(sec(5) && Player.getDimension() !== InfiniteForest.id) this.remove = true;
        const pos = Player.getPosition();
        const moon = this.moon as Animation.Base;
     moon.setPos(pos.x + 15, pos.y + 15, pos.z);
     moon.load();
    } 
}}

Callback.addCallback("ItemUse", (coords, item) => {
    if(item.id === VanillaItemID.bone) Updatable.addLocalUpdatable(InfiniteTick());
    if(item.id === VanillaItemID.coal) green_moon.model(); green_moon.model().load();
})
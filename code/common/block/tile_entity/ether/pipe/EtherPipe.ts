class EtherPipe extends BasicBlock implements IProjectileHitCallback {
    public static GROUP = ICRender.getGroup("infinite_forest.ether_pipe");
    public constructor() {
        super("ether_pipe", [
            {
                name: "block.infinite_forest.ether_pipe",
                texture: [["ether_pipe", 0]],
                inCreative: true
            }
        ]);
        EtherPipe.GROUP.add(this.id, -1);
        const width = (2 / 8) / 2;

        const render = new ICRender.Model();
    
        const upperCap = BlockRenderer.createModel();
        upperCap.addBox(0.4 - width, 1 - 0.25, 0.4 - width, 0.6 + width, 1, 0.6 + width, VanillaBlockID.stone, 2);

        const downCap = BlockRenderer.createModel();
        downCap.addBox(0.4 - width, 0, 0.4 - width, 0.6 + width, 0.25, 0.6 + width, VanillaBlockID.stone, 2);

        const commonTube = BlockRenderer.createModel();
        commonTube.addBox(0.5 - width, 0, 0.5 - width, 0.5 + width, 1, 0.5 + width, [
            ["ether_pipe", 0]
        ]);

        const upperTube = BlockRenderer.createModel();
        upperTube.addBox(0.5 - width, 0, 0.5 - width, 0.5 + width, 1 - 4 / 16, 0.5 + width, [
            ["ether_pipe", 0]
        ]);

        const downTube = BlockRenderer.createModel();
        downTube.addBox(0.5 - width, 4 / 16, 0.5 - width, 0.5 + width, 1, 0.5 + width, [
            ["ether_pipe", 0]
        ]);
        
        render.addEntry(downCap).setCondition(ICRender.BLOCK(0, -1, 0, EtherPipe.GROUP, true));        
        render.addEntry(upperCap).setCondition(ICRender.BLOCK(0, 1, 0, EtherPipe.GROUP, true));
        render.addEntry(commonTube).setCondition(ICRender.AND(
            ICRender.BLOCK(0, -1, 0, EtherPipe.GROUP, false),
            ICRender.BLOCK(0, 1, 0, EtherPipe.GROUP, false)
        ));
        render.addEntry(downTube).setCondition(ICRender.BLOCK(0, -1, 0, EtherPipe.GROUP, true));
        render.addEntry(upperTube).setCondition(ICRender.BLOCK(0, 1, 0, EtherPipe.GROUP, true));
        BlockRenderer.setStaticICRender(this.id, -1, render);
    }

    public onProjectileHit(projectile: number, item: ItemStack, target: Callback.ProjectileHitTarget): void {
        if(Entity.getType(projectile) == EEntityType.ARROW) {
            const region = BlockSource.getDefaultForActor(projectile);
            let coords = target.coords;
            let index = 0;
            while(true) {
                region.destroyBlock(coords.x, coords.y - index, coords.z);
                index++;
                if(region.getBlockID(coords.x, coords.y - index, coords.z) != this.id) {
                    return;
                }
            }
        }
    }

    public override getSoundType(): Block.Sound {
        return "glass";
    }
}

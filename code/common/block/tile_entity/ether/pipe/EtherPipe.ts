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
        const hasUpper = ICRender.BLOCK(0, 1, 0, EtherPipe.GROUP, true);
        const hasDown = ICRender.BLOCK(0, -1, 0, EtherPipe.GROUP, true);
    
        const upperModel = BlockRenderer.createModel();
        upperModel.addBox(0.4 - width, 1 - 0.25, 0.4 - width, 0.6 + width, 1, 0.6 + width, this.id, -1);

        const downModel = BlockRenderer.createModel();
        downModel.addBox(0.4 - width, 0, 0.4 - width, 0.6 + width, 0.25, 0.6 + width, this.id, -1);

        const commonModel = BlockRenderer.createModel();
        commonModel.addBox(0.5 - width, 0, 0.5 - width, 0.5 + width, 1, 0.5 + width, this.id, -1);
        
        render.addEntry(downModel).setCondition(hasDown);        
        render.addEntry(upperModel).setCondition(hasUpper);
        render.addEntry(commonModel);
        BlockRenderer.setStaticICRender(this.id, -1, render);
    }

    public override canRotate(): boolean {
        return true;
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

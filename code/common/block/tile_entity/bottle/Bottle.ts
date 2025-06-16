class Bottle extends BasicBlock implements IRandomTickCallback, IProjectileHitCallback {
    public constructor() {
        super("bottle", [{
            name: "block.infinite_forest.bottle",
            texture: [["forest_bottle", 0]],
            inCreative: true
        }]);
    }

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/bottle", "forest_bottle");
    }

    public override getSoundType(): Block.Sound {
        return "glass";
    }

    public onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void {
        const isColdState = Utils.getBiomeState(x, z, region) === EBiomeState.COLD;

        if((y >= 200 || isColdState) && Curse.has("cold")) {
            region.destroyBlock(x, y, z, false);
        }

        this.addFireflies(x, y, z, region, ParticleHelper.getRandomGlowworm());
    }

    public addFireflies(x: number, y: number, z: number, region: BlockSource, color: number) {
        const upperBlock = region.getBlockID(x, y + 1, z);
        const luckilyRandom = Math.random() > 0.4;

        if(Block.getLightLevel(upperBlock) < 10) return;
         
        if(!luckilyRandom) {
            region.breakBlock(x, y, z, false);
            region.breakBlock(x, y + 1, z, true);
            return;
        }

        ParticleHelper.sendWithRadius(x - 30, y - 10, z - 30, x + 30, y + 10, z + 30, region, {
            type: color,
            x: x + 0.5,
            y: y + 1.5,
            z: z + 0.5,
            vx: 0,
            vy: -0.3,
            vz: 0
        });

        TileEntity.destroyTileEntityAtCoords(x, y, z, region);
        region.setBlock(x, y, z, BlockList.FIREFLIES_BOTTLE.id);

        Bottle.addTile(x, y, z, region, color);
        return;
    }

    public static addTile(x: number, y: number, z: number, region: BlockSource, color: number) {
        TileEntity.addTileEntity(x, y, z, region);

        const tile = TileEntity.getTileEntity(x, y, z, region) as TileEntity & FirefliesBottleTile;

        if(tile) {
            tile.data.color = color;
            tile.networkData.putInt("color", color);
            tile.networkData.sendChanges();
        }
    }

    public onProjectileHit(projectile: number, item: ItemStack, target: Callback.ProjectileHitTarget): void {
        if(Entity.getType(target.entity) == EEntityType.ARROW) {
            BlockSource.getDefaultForActor(projectile).destroyBlock(target.x, target.y, target.z, true);
        }
    }
}


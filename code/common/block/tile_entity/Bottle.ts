class Bottle extends BlockForest {
    public constructor() {
        super("bottle", [{
            name: "block.infinite_forest.bottle",
            texture: [["forest_bottle", 0]],
            inCreative: true
        }]);
    };

    public override getModel(): BlockModel | BlockModel[] {
        return new BlockModel("bottle", "forest_bottle");
    };

    public override getSoundType(): Block.Sound {
        return "glass";
    };

    public override onRandomTick(x: number, y: number, z: number, block: Tile, region: BlockSource): void {
        const isColdState = Utils.getBiomeState(x, z, region) === EBiomeState.COLD;

        if ((y >= 200 || isColdState) && Curse.has("cold")) {
            region.destroyBlock(x, y, z, false);
        };

        this.addFireflies(x, y, z, region, ParticleHelper.getRandomGlowworm());
    };

    public addFireflies(x: number, y: number, z: number, region: BlockSource, color: number) {
        const upperBlock = region.getBlockID(x, y + 1, z);
        const luckilyRandom = Math.random() > 0.4;

        if(Block.getLightLevel(upperBlock) < 10) return;
         
        if(!luckilyRandom) {
            region.breakBlock(x, y, z, false);
            region.breakBlock(x, y + 1, z, true);
            return;
        };

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
    };

    public static addTile(x: number, y: number, z: number, region: BlockSource, color: number) {
        TileEntity.addTileEntity(x, y, z, region);

        const tile = TileEntity.getTileEntity(x, y, z, region) as TileEntity & FirefliesBottleTile;

        if(tile) {
            tile.data.color = color;
            tile.networkData.putInt("color", color);
            tile.networkData.sendChanges();
        };
    };
};

class FirefliesBottleTile extends TileEntityBase {
    public defaultValues = {
        color: null
    };

    public data: typeof this.defaultValues;

    public override onLoad(): void {
        this.data.color ??= ParticleHelper.getRandomGlowworm();
        this.networkData.putInt("color", this.data.color);
        this.networkData.sendChanges();
    };

    public override clientTick(): void {
        if(World.getThreadTime() % 10 === 0) {
            const color = this.networkData.getInt("color", EForestParticle.GLOWWORM_2);

            Particles.addParticle(
                color,
                this.x + 0.5,
                this.y + 0.45,
                this.z + 0.5,
                0.001,
                0.001,
                0.001
            );
        };
    };

    // public override onTick(): void {
    //     if(World.getThreadTime() % 60 === 0) {
    //         if(this.data.color === null) {
    //             this.data.color = ParticleHelper.getRandomGlowworm();
    //         };
    //     }  
    // };
};

class FirefliesBottle extends BlockForest {
    public constructor() {
        super("fireflies_bottle", [{
            name: "block.infinite_forest.fireflies_bottle",
            texture: [["forest_bottle", 0]],
            inCreative: true
        }]);
    };

    public override getModel(): BlockModel | BlockModel[] {
        return new BlockModel("bottle", "forest_bottle");
    };

    public override getLightLevel(): number {
        return 10;
    };

    public override onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        let color = ParticleHelper.getRandomGlowworm();

        if(item.extra) {
            color = item.extra.getInt("color", color);
        };

        region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockList.FIREFLIES_BOTTLE.id, 0);

        Bottle.addTile(
            coords.relative.x, 
            coords.relative.y + 1, 
            coords.relative.z, 
            BlockSource.getDefaultForActor(player), 
            color
        );

        return;
    };

    public getDrop(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region) as TileEntity & FirefliesBottleTile;

        let extra = null;

        if(tile && tile.data.color) {
            extra = new ItemExtraData();
            extra.putInt("color", tile.data.color);
        };

        return [[block.id, 1, block.data, extra]];
    };

    public override getTileEntity(): TileEntityBase {
        return new FirefliesBottleTile();
    };

    public override getSoundType(): Block.Sound {
        return "glass";
    };
};
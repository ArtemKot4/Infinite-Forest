class BlockForest implements BlockBehavior, IBlockModel {
    public static destroyContinueFunctions: Record<number, Callback.DestroyBlockContinueFunction> = {};
    public static destroyStartFunctions: Record<number, Callback.DestroyBlockFunction> = {};

    public readonly variationList: Block.BlockVariation[];

    public readonly id: number;
    public readonly stringID: string;

    public constructor(stringID: string, variationList: Block.BlockVariation[]) {
        this.id = IDRegistry.genBlockID(stringID);

        this.stringID = stringID;
        this.variationList = variationList;
    }

    public build() {
        BlockRegistry.registerBlockFuncs(this.id, this);

        const tags = this.getTags();

        if(tags) {
            TagRegistry.addCommonObject("blocks", this.id, tags);
        };

        if("getModel" in this) {
            const modelList: BlockModel[] = [].concat(this.getModel());

            if (modelList.length === 1) {
                this.setModel(modelList[0], -1);
                return;
            }

            for (let i: number = 0; i < modelList.length; i++) {
                const data: number = modelList[i].getBlockData();
                this.setModel(modelList[i], data > -1 ? data : i);
            };
        };

        if("getDestroyTime" in this) {
            Block.setDestroyTime(this.id, this.getDestroyTime());
        };

        if("getSoundType" in this) {
            BlockRegistry.setSoundType(this.id, this.getSoundType());
        };

        if("getFriction" in this) {
            BlockRegistry.setFriction(this.id, this.getFriction());
        };

        if("getLightLevel" in this) {
            BlockRegistry.setLightLevel(this.id, this.getLightLevel());
        };

        if("getLightOpacity" in this) {
            BlockRegistry.setLightOpacity(this.id, this.getLightOpacity());
        };

        if("getExplosionResistance" in this) {
            BlockRegistry.setExplosionResistance(this.id, this.getExplosionResistance());
        };

        if("getMapColor" in this) {
            BlockRegistry.setMapColor(this.id, this.getMapColor());
        };

        if("getMaterial" in this) {
            Block.setBlockMaterial(this.id, this.getMaterial(), this.getDestroyLevel());
        };

        if("getRenderLayer" in this) {
            BlockRegistry.setRenderLayer(this.id, this.getRenderLayer());
        };

        if("getTranslurency" in this) {
            BlockRegistry.setTranslucency(this.id, this.getTranslurency());
        };

        if("isSolid" in this) {
            BlockRegistry.setSolid(this.id, this.isSolid());
        };

        if("getRenderType" in this) {
            BlockRegistry.setRenderType(this.id, this.getRenderType());
        };

        if("getTileEntity" in this) {
            this.setTileEntity(this.getTileEntity());
        };

        if("getCreativeGroup" in this) {
            const group = this.getCreativeGroup();
            Item.addCreativeGroup(group, Translation.translate(group), [this.id]);
        };

        if("onDestroyContinue" in this) {
            BlockForest.destroyContinueFunctions[this.id] = this.onDestroyContinue;
        };

        if("onDestroyStart" in this) {
            BlockForest.destroyStartFunctions[this.id] = this.onDestroyStart;
        }

        Block.setDestroyLevel(this.id, this.getDestroyLevel());
    }

    public create(): this {
        Block.createBlock(this.stringID, this.variationList);
        this.build();
        return this;
    }

    public createWithRotation(): this {
        Block.createBlockWithRotation(this.stringID, this.variationList);
        this.build();
        return this;
    }

    public setModel(model: BlockModel, data: number): this {
        const render: ICRender.Model = new ICRender.Model();

        render.addEntry(new BlockRenderer.Model(model.getRenderMesh()));
        BlockRenderer.setStaticICRender(this.id, data ?? model.getBlockData(), render);

        return this;
    }

    public getID() {
        return BlockID[this.stringID]
    };
    
    public getModel?(): BlockModel | BlockModel[];

    public getTags?(): string[] {
        return null;
    };

    public getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];

    public onDestroy?(coords: Vector, block: Tile, region: BlockSource, player: number): void;

    public onDestroyContinue?(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void;
    
    public onDestroyStart?(coords: Callback.ItemUseCoordinates, block: Tile, player: number);

    public onBreak?(coords: Vector, block: Tile, region: BlockSource): void;

    public onPlace?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;

    public onNeighbourChange?(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void;

    public onEntityInside?(coords: Vector, block: Tile, entity: number): void;

    public onEntityStepOn?(coords: Vector, block: Tile, entity: number): void;

    public onRandomTick?(x: number, y: number, z: number, block: Tile, region: BlockSource): void;

    public onAnimateTick?(x: number, y: number, z: number, id: number, data: number): void;

    public onClick?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;

    public getDestroyTime?(): number;

    public getSoundType?(): Block.Sound;

    public getFriction?(): number;

    public getLightLevel?(): number;

    public getLightOpacity?(): number;

    public getExplosionResistance?(): number;

    public getMapColor?(): number;

    public getMaterial?(): string;

    public getRenderLayer?(): number;

    public getRenderType?(): number;

    public getTranslurency?(): number;

    public getDestroyLevel(): MiningLevel {
        return MiningLevel.STONE;
    }

    public getCreativeGroup?(): string;

    public getTileEntity?(): TileEntityBase;

    public setTileEntity(tileEntity: TileEntityBase) {
        TileEntity.registerPrototype(this.id, tileEntity);
    }

    public isSolid?(): boolean;
};

Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
    const hasFunction = BlockForest.destroyContinueFunctions[block.id];

    if(hasFunction) {
        hasFunction(coords, block, progress);
    }
});

Callback.addCallback("DestroyBlockStart", (coords, block, player) => {
    const hasFunction = BlockForest.destroyStartFunctions[block.id];

    if(hasFunction) {
        hasFunction(coords, block, player);
    };
});
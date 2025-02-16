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

        this.build();
    };

    public canRotate() {
        return false;
    };

    public build() {
        const canRotate = this.canRotate();

        if(canRotate) {
            this.variationList.map((v) => {
                if(v.texture.length < 6) {
                    for(let i = v.texture.length; i < 6; i++) {
                        v.texture.push(v.texture[v.texture.length - 1]);
                    };
                };
                return v;
            });
            Block.createBlockWithRotation(this.stringID, this.variationList);
        } else {
            Block.createBlock(this.stringID, this.variationList);
        };

        BlockRegistry.registerBlockFuncs(this.id, this);

        const tags = this.getTags();

        if(tags) {
            TagRegistry.addCommonObject("blocks", this.id, tags);
        };

        if("getModel" in this) {
            const modelList: BlockModel[] = [].concat(this.getModel());

            if(modelList.length === 1) {
                this.setModel(modelList[0], -1);
            } else {
                for (let i: number = 0; i < modelList.length; i++) {
                    const model = modelList[i];

                    const data: number = model instanceof BlockModel ? model.getBlockData() : i;
                    this.setModel(model, data);
                };
            };
        };

        if("getDestroyTime" in this) {
            Block.setDestroyTime(this.stringID, this.getDestroyTime());
        };

        if("getSoundType" in this) {
            BlockRegistry.setSoundType(this.stringID, this.getSoundType());
        };

        if("getFriction" in this) {
            BlockRegistry.setFriction(this.stringID, this.getFriction());
        };

        if("getLightLevel" in this) {
            BlockRegistry.setLightLevel(this.stringID, this.getLightLevel());
        };

        if("getLightOpacity" in this) {
            BlockRegistry.setLightOpacity(this.stringID, this.getLightOpacity());
        };

        if("getExplosionResistance" in this) {
            BlockRegistry.setExplosionResistance(this.stringID, this.getExplosionResistance());
        };

        if("getMapColor" in this) {
            BlockRegistry.setMapColor(this.stringID, this.getMapColor());
        };

        if("getMaterial" in this) {
            Block.setBlockMaterial(this.stringID, this.getMaterial(), this.getDestroyLevel());
        };

        if("getRenderLayer" in this) {
            BlockRegistry.setRenderLayer(this.stringID, this.getRenderLayer());
        };

        if("getTranslurency" in this) {
            BlockRegistry.setTranslucency(this.stringID, this.getTranslurency());
        };

        if("isSolid" in this) {
            BlockRegistry.setSolid(this.stringID, this.isSolid());
        };

        if("getRenderType" in this) {
            BlockRegistry.setRenderType(this.stringID, this.getRenderType());
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

        Block.setDestroyLevel(this.stringID, this.getDestroyLevel());
    };

    public setModel(model: BlockModel | RenderMesh, data: number): this {
        const render: ICRender.Model = new ICRender.Model();
        let mesh;
        let _data = data;

        if(model instanceof BlockModel) {
            mesh = model.getRenderMesh();
            _data = model.getBlockData();
        } else mesh = model;

        render.addEntry(new BlockRenderer.Model(mesh));
        BlockRenderer.setStaticICRender(this.id, data ?? mesh, render);

        return this;
    };

    public getID() {
        return BlockID[this.stringID];
    };
    
    public getModel?(): RenderMesh | RenderMesh[] | BlockModel | BlockModel[];

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

    public static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource) {
        TileEntity.destroyTileEntityAtCoords(x, y, z, blockSource);
        blockSource.destroyBlock(x, y, z, true);
        return;
    };
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
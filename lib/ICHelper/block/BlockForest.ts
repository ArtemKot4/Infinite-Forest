interface IDestroyCallback {
    onDestroy(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void
};

interface IDestroyContinueCallback {
    onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void
};

interface IDestroyStartCallback {
    onDestroyStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void
};

interface IPlaceCallback {
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource): Vector | void
};

interface INeighbourChangeCallback {
    onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void
};

interface IEntityInsideCallback {
    onEntityInside(blockCoords: Vector, block: Tile, entity: number): void
};

interface IEntityStepOnCallback {
    onEntityStepOn(coords: Vector, block: Tile, entity: number): void
};

interface IRandomTickCallback {
    onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
};

interface IAnimateTickCallback {
    onAnimateTick(x: number, y: number, z: number, id: number, data: number): void;
};

interface IClickCallback {
    onClick(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
};

class BlockForest {
    public static destroyContinueFunctions: Record<number, Callback.DestroyBlockContinueFunction> = {};
    public static destroyStartFunctions: Record<number, Callback.DestroyBlockFunction> = {};
    public static destroyFunctions: Record<number, Callback.DestroyBlockFunction> = {};

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

        const tags = this.getTags();

        if(tags) {
            TagRegistry.addCommonObject("blocks", this.id, tags);
        };

        if("getModel" in this) {
            const modelList: BlockModel[] = [].concat((this as IBlockModel).getModel());

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
            Block.setDestroyTime(this.id, this.getDestroyTime());
        };

        if("getSoundType" in this) {
            NativeBlock.setSoundType(this.id, this.getSoundType());
        };

        if("getFriction" in this) {
            NativeBlock.setFriction(this.id, this.getFriction());
        };

        if("getLightLevel" in this) {
            NativeBlock.setLightLevel(this.id, this.getLightLevel());
        };

        if("getLightOpacity" in this) {
            NativeBlock.setLightOpacity(this.id, this.getLightOpacity());
        };

        if("getExplosionResistance" in this) {
            NativeBlock.setExplosionResistance(this.id, this.getExplosionResistance());
        };

        if("getMapColor" in this) {
            NativeBlock.setMapColor(this.id, this.getMapColor());
        };

        if("getMaterial" in this) {
            ToolAPI.registerBlockMaterial(this.id, this.getMaterial(), this.getDestroyLevel());
        };

        if("getRenderLayer" in this) {
            NativeBlock.setRenderLayer(this.id, this.getRenderLayer());
        };

        if("getTranslurency" in this) {
            NativeBlock.setTranslucency(this.id, this.getTranslurency());
        };

        if("isSolid" in this) {
            NativeBlock.setSolid(this.id, this.isSolid());
        };

        if("getRenderType" in this) {
            NativeBlock.setRenderType(this.id, this.getRenderType());
        };

        if("getTileEntity" in this) {
            this.setTileEntity(this.getTileEntity());
        };

        if("getCreativeGroup" in this) {
            const group = this.getCreativeGroup();
            Item.addCreativeGroup(group, Translation.translate(group), [this.id]);
        };

        if("getDrop" in this) {
            Block.registerDropFunctionForID(this.id, this.getDrop);
        };

        if("onDestroy" in this) {
            BlockForest.destroyFunctions[this.id] = (this as IDestroyCallback).onDestroy;
        };

        if("onDestroyContinue" in this) {
            BlockForest.destroyContinueFunctions[this.id] = (this as IDestroyContinueCallback).onDestroyContinue;
        };

        if("onDestroyStart" in this) {
            BlockForest.destroyStartFunctions[this.id] = (this as IDestroyStartCallback).onDestroyStart;
        };

        if("onPlace" in this) {
            Block.registerPlaceFunctionForID(this.id, (this as IPlaceCallback).onPlace);
        };

        if("onNeighbourChange" in this) {
            Block.registerNeighbourChangeFunctionForID(this.id, (this as INeighbourChangeCallback).onNeighbourChange);
        };

        if("onEntityInside" in this) {
            Block.registerEntityInsideFunctionForID(this.id, (this as IEntityInsideCallback).onEntityInside);
        };

        if("onEntityStepOn" in this) {
            Block.registerEntityStepOnFunctionForID(this.id, (this as IEntityStepOnCallback).onEntityStepOn);
        };

        if("onRandomTick" in this) {
            Block.setRandomTickCallback(this.id, (this as IRandomTickCallback).onRandomTick);
        };

        if("onClick" in this) {
            Block.registerClickFunctionForID(this.id, (this as IClickCallback).onClick);
        };

        ItemForest.setFunctions(this);

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

    public getTags?(): string[] {
        return null;
    };

    public getDrop?(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[]

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

    public getDestroyLevel(): EDestroyLevel {
        return EDestroyLevel.STONE;
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

Callback.addCallback("DestroyBlock", (coords, block, player) => {
    const hasFunction = BlockForest.destroyFunctions[block.id];

    if(hasFunction) {
        hasFunction(coords, block, player);
    };
    
});


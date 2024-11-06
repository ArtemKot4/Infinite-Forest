class BlockForest implements BlockBehavior, IBlockModel {

    public readonly variations: Block.BlockVariation[];

    public readonly id: number;
    public readonly stringID: string;

    public constructor(stringID: string, variations: Block.BlockVariation[]) {
        this.id = IDRegistry.genBlockID(stringID);
 
        this.stringID = stringID;
        this.variations = variations;
    };

    public build() {
       BlockRegistry.registerBlockFuncs(this.id, this);

       if('getModel' in this) {
          this.setModel(this.getModel());
       };

       if('getDestroyTime' in this) {
          Block.setDestroyTime(this.id, this.getDestroyTime());
       };

       if('getSoundType' in this) {
          BlockRegistry.setSoundType(this.id, this.getSoundType());
       };

       if('getFriction' in this) {
          BlockRegistry.setFriction(this.id, this.getFriction());
       };

       if('getLightLevel' in this) {
          BlockRegistry.setLightLevel(this.id, this.getLightLevel());
       };

       if('getLightOpacity' in this) {
          BlockRegistry.setLightOpacity(this.id, this.getLightOpacity());
       };

       if('getExplosionResistance' in this) {
          BlockRegistry.setExplosionResistance(this.id, this.getExplosionResistance());
       };

       if('getMapColor' in this) {
          BlockRegistry.setMapColor(this.id, this.getMapColor());
       };

       if('getMaterial' in this) {
          Block.setBlockMaterial(this.id, this.getMaterial(), this.getDestroyLevel());
       };

       if('getRenderLayer' in this) {
          BlockRegistry.setRenderLayer(this.id, this.getRenderLayer());
       };

       if('getTranslurency' in this) {
          BlockRegistry.setTranslucency(this.id, this.getTranslurency());
       };

       if('getTileEntity' in this) {
          this.setTileEntity(new (this.getTileEntity())());
       }

       Block.setDestroyLevel(this.id, this.getDestroyLevel());

    };

    public create(): void {
       Block.createBlock(this.stringID, this.variations,)
       this.build();
    };

    public createWithRotation(): void {
       this.build();
    };

    public setModel(model: BlockModel): this {
       const render: ICRender.Model = new ICRender.Model();

       render.addEntry(new BlockRenderer.Model(model.getRenderMesh()));
       BlockRenderer.setStaticICRender(this.id, model.getBlockData(), render);

       return this;
    };

    public getModel?(): BlockModel;

    public getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];

    public onDestroy?(coords: Vector, block: Tile, region: BlockSource, player: number): void;

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
    };

    public getTileEntity?<T extends new () => TileEntityBase>(): T;

    public setTileEntity(tileEntity: TileEntityBase) {
        TileEntity.registerPrototype(this.id, tileEntity);
    };

    public isSolid?(): boolean;

};

class LocalCandleTile extends LocalTileEntity {
    public onTick(): void {
        const flames = this.networkData.getInt("flames", 0);

        if(flames >= 1) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.5 + Math.random() / 20,
                this.y + 0.75 + Math.random() / 20,
                this.z + 0.5 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };

        if(flames >= 2) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.8 + Math.random() / 20,
                this.y + 0.6 + Math.random() / 20,
                this.z + 0.5 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };
        
        if(flames >= 3) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.8 + Math.random() / 20,
                this.y + 0.6 + Math.random() / 20,
                this.z + 0.5 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };

        if(flames >= 4) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.2 + Math.random() / 20,
                this.y + 0.6 + Math.random() / 20,
                this.z + 0.5 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };

        if(flames >= 5) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.5 + Math.random() / 20,
                this.y + 0.6 + Math.random() / 20,
                this.z + 0.8 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };

        if(flames >= 6) {
            Particles.addParticle(
                EParticleType.FLAME,
                this.x + 0.5 + Math.random() / 20,
                this.y + 0.6 + Math.random() / 20,
                this.z + 0.2 + Math.random() / 20,
                0,
                0,
                0,
                1
            );
        };
 
    };
}

class CandleTile extends CommonTileEntity {
    public defaultValues = {
        flames: 0
    };

    public data: typeof this.defaultValues;
    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        const blockData = this.blockSource.getBlockData(coords.x, coords.y, coords.z);

        if(this.data.flames < Candle.meshes.length && item.id === VanillaItemID.flint_and_steel) {
            const isIncreased = this.increaseFlames();

            if(isIncreased) {
                Entity.setCarriedItem(player, item.id, item.count, item.data + 1, item.extra);
            };
            return;
        };

        if(blockData < (Candle.meshes.length - 1) && Utils.getBlockTags(item.id).includes("candle")) {
            const entity = new PlayerUser(player);

            entity.decreaseCarriedItem(1);
            BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y, coords.z, this.blockID, this.blockSource.getBlockData(this.x, this.y, this.z) + 1);
        };
    };

    public increaseFlames(): boolean {
        const blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
        const increasedFlame = Math.min(this.data.flames + 1, Candle.meshes.length);

        if(increasedFlame !== blockData || this.data.flames === increasedFlame) return false;

        this.data.flames = increasedFlame

        this.networkData.putInt("flames", increasedFlame);
        this.networkData.sendChanges();

        this.blockSource.setBlock(this.x, this.y, this.z, BlockID["candle_lit_" + increasedFlame],
         blockData);
        TileEntity.addTileEntity(this.x, this.y, this.z, this.blockSource);
        return true;
    };

    public override getLocalTileEntity(): LocalTileEntity {
        return new LocalCandleTile();
    }
};

class Candle extends BasicBlock {
    public static meshes = (() => {
        const big = RenderHelper.generateMesh(modelsdir, "block/candle_max");
        const small = RenderHelper.generateMesh(modelsdir, "block/candle_min");
    
        big.setBlockTexture("candle", 0);
        small.setBlockTexture("candle", 0);
    
        const copy_1 = big.clone();
        copy_1.addMesh(small, 0.3, 0, 0);
    
        const copy_2 = copy_1.clone();
        copy_2.addMesh(small, -0.3, 0, 0);
    
        const copy_3 = copy_2.clone();
        copy_3.addMesh(small, 0, 0, 0.3);
    
        const copy_4 = copy_3.clone();
        copy_4.addMesh(small, 0, 0, -0.3);
    
        return [big, copy_1, copy_2, copy_3, copy_4];
    })();

    public static tile = new CandleTile();

    public constructor(light_level: number) {
        super("candle_lit_" + light_level, [{
            name: "block.infinite_forest.candle",
            texture: [["candle", 0]],
            inCreative: false
        }]);

        NativeBlock.setLightLevel(this.id, light_level);
    };

    public getTags(): string[] {
        return ["candle"];
    };

    public getModel(): RenderMesh[] {
        return Candle.meshes;
    };

    public getTileEntity(): CommonTileEntity {
        return Candle.tile;
    };
};

const CandleList: Candle[] = [];
[0, 1, 3, 5].forEach(v => CandleList[v] = new Candle(v));

Item.addToCreative(CandleList[0].id, 1, 0);

Translation.addTranslation("block.infinite_forest.candle", {
    en: "Candle",
    ru: "Cвеча"
});
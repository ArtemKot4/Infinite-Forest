class Candle extends BasicBlock {
    public static meshes = (() => {
        const big = RenderHelper.generateMesh(modelsdir, "block/candle_max");
        const small = RenderHelper.generateMesh(modelsdir, "block/candle_min");
    
        big.setBlockTexture("candle", 0);
        small.setBlockTexture("candle", 0);
    
        const copy_1 = big.clone();
        copy_1.addMesh(small, 0.3, -0, 0);
    
        const copy_2 = copy_1.clone();
        copy_2.addMesh(small, -0.3, 0, 0);
    
        const copy_3 = copy_2.clone();
        copy_3.addMesh(small, 0, 0, 0.3);
    
        const copy_4 = copy_3.clone();
        copy_4.addMesh(small, 0, 0, -0.3);
    
        return [big, copy_1, copy_2, copy_3, copy_4];
    })();

    public static tile = new CandleTile();

    public constructor(id: number, lightLevel: number) {
        super("ether_candle_lit_" + id, [{
            name: "block.infinite_forest.candle",
            texture: [["candle", 0]],
            inCreative: false
        }]);

        NativeBlock.setLightLevel(this.id, lightLevel);
    }

    public getTags(): string[] {
        return ["candle"];
    }

    public getModel(): RenderMesh[] {
        return Candle.meshes;
    }

    public getTileEntity(): CommonTileEntity {
        return Candle.tile;
    }
}
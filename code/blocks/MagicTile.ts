let visionMode = true;

class MagicTile extends TileEntityBase {
    public static getDependendState(biome: ForestBiomes.ForestBiome, coords: Vector, blockSource: BlockSource) {
        const state = ForestBiomes.ForestBiome.getState(blockSource.getBiome(coords.x, coords.z));
        let status = true;
            switch(state) {
            case EForestState.ICE: status = ColdCurse.has()
            break;
            case EForestState.FIRE: status = false;
            break;
            case EForestState.BALANCE: status = true;
            break;
        };
        return status
    };
    data: {
     
    };

};

const MagicFlameBlock = new FBlock("magic_flame", [{
    name: "block.infinite_forest.magic_flame",
    texture: [["unknown", 0]],
    inCreative: true
}]).create();

//Block.setShape(MagicFlameBlock.getID(), 4/16, 4/16, 4/16, 8/16, 8/16, 8/16);

class MagicFlame extends MagicTile {
    onTick(): void {
        if(World.getThreadTime() % 200 === 0) {
          Game.message("mode: " + visionMode);
        };
    };
    clientTick(): void {
        if(visionMode === true) {
           Plants.Mushroom.particle(this, 0.4)
        }
    }
};

TileEntity.registerPrototype(MagicFlameBlock.getID(), new MagicFlame());


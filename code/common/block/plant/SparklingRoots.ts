class SparklingRoots extends BasicBlock implements IPlaceCallback, IClickCallback {
    public constructor() {
        super("sparkling_roots", [{
            name: "block.infinite_forest.sparkling_roots",
            texture: [["sparkling_roots", 0]],
            inCreative: true
        }]);

        Block.setShape(this.id,  1/8, 0, 1/8, 7/8, 1, 7/8, 0);
        //Item.setFireResistant(this.stringID, true);
        // Block.setShape(this.id, 1/8, 1/8, 0, 7/8, 7/8, 8, 1);
        // Block.setShape(this.id, 7/8, 1/8, 1, 7/8, 1/8, 2);
    }

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        let data = 0;

        switch(coords.side) {
            case 5:
                data = 2;
                break;
            case 4:
                data = 2;
                break;
            case 3:
                data = 1;
                break;
            case 2:
                data = 1;
                break;
        };

        region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, this.id, data);
    }

    public burn(coords: Vector, region: BlockSource): void {
        const self = this;
        region.setExtraBlock(coords.x, coords.y, coords.z, VanillaBlockID.fire);
        Updatable.addUpdatable({
            time: 0,
            update() {
                if(World.getThreadTime() % 20 == 0) {
                    this.time++;
                }
                if(region.getBlockID(coords.x, coords.y, coords.z) != self.id) {
                    this.remove = true;
                }
                if(this.time >= 5) {
                    region.destroyBlock(coords.x, coords.y, coords.z, false);
                    region.setBlock(coords.x, coords.y, coords.z, 0);
                    region.spawnDroppedItem(coords.x + 0.5, coords.y, coords.z + 0.5, self.id, 1, 0);
                    this.remove = true;
                }
            },
        })
    }

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(item.id == VanillaItemID.flint_and_steel) { 
            const region = BlockSource.getDefaultForActor(player);

            for(let i = coords.y; i > 0; i--) {
                if(region.getBlockID(coords.x, i, coords.z) == this.id) {
                    this.burn(new Vector3(coords.x, i, coords.z), region);
                }
            }
        }
    }

    public getDrop(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[VanillaItemID.stick, MathHelper.randomInt(1, 4), 0]];
    }

    public getSoundType(): Block.Sound {
        return "grass";
    }
}
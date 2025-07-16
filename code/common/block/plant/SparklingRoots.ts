class SparklingRoots extends BasicBlock implements IPlaceCallback, IClickCallback {
    public static GROUP = ICRender.getGroup("if.roots");

    public constructor() {
        super("sparkling_roots", [{
            name: "block.infinite_forest.sparkling_roots",
            texture: [["sparkling_roots", 0]],
            inCreative: true
        }]);

        this.setShapes();
    }

    public setShapes(): void {
        const render = new ICRender.Model();
        const firstModel = new BlockRenderer.Model();
        SparklingRoots.GROUP.add(this.id, -1);

        firstModel.addBox(2 / 16, 0,2 / 16, 14 / 16, 1, 14 / 16, this.id, -1);

        const secondModel = new BlockRenderer.Model();
        secondModel.addBox(4 / 16, 0, 4 / 16, 12 / 16, 1, 12 / 16, this.id, -1);

        const thirdModel = new BlockRenderer.Model();
        thirdModel.addBox(5 / 16, 0, 5 / 16, 11 / 16, 1, 11 / 16, this.id, -1);
        
        render.addEntry(firstModel).setCondition(ICRender.BLOCK(0, 1, 0, SparklingRoots.GROUP, true));
        render.addEntry(secondModel).setCondition(ICRender.OR(
            ICRender.AND(
                ICRender.BLOCK(0, 1, 0, SparklingRoots.GROUP, false),
                ICRender.BLOCK(0, 2, 0, SparklingRoots.GROUP, true)    
            ),
            ICRender.AND(
                ICRender.BLOCK(0, 2, 0, SparklingRoots.GROUP, false),
                ICRender.BLOCK(0, 3, 0, SparklingRoots.GROUP, true)    
            ),
            ICRender.AND(
                ICRender.BLOCK(0, 3, 0, SparklingRoots.GROUP, false),
                ICRender.BLOCK(0, 4, 0, SparklingRoots.GROUP, true)    
            )
        ));
        render.addEntry(thirdModel).setCondition(ICRender.BLOCK(0, 4, 0, SparklingRoots.GROUP, false));

        BlockRenderer.setStaticICRender(this.id, -1, render);
        // const collisionShape = new ICRender.CollisionShape();
        // const model = new BlockRenderer.Model();

        // collisionShape.addEntry().addBox(1/8, 0, 1/8, 7/8, 1, 7/8);
        // model.addBox(0, 0, 0, 0, 0, 0, this.id, 1);
        
        // const icrender = new ICRender.Model(model);
        
        // BlockRenderer.setCustomCollisionShape(this.id, 1, collisionShape);
        // BlockRenderer.setStaticICRender(this.id, 1, icrender);
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

    public burn(coords: Vector, region: BlockSource, playerUid: number): void {
        const self = this;
        //region.setBlock(coords.x, coords.y, coords.z, this.id, 1);
        region.setExtraBlock(coords.x, coords.y, coords.z, VanillaBlockID.fire);
        
        // const client = Network.getClientForPlayer(playerUid);
        // if(client) {
        //     client.send("packet.infinite_forest.burn_sparkling_roots", {
        //         coords, blockID: this.id
        //     });
        // }

        Updatable.addUpdatable({
            time: 0,
            update() {
                if(World.getThreadTime() % 20 == 0) {
                    this.time++;
                }
                if(region.getBlockID(coords.x, coords.y, coords.z) != self.id) {
                    this.animation.destroy();
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

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number): void {
        if(item.id == VanillaItemID.flint_and_steel) { 
            const region = BlockSource.getDefaultForActor(playerUid);

            for(let i = coords.y; i > 0; i--) {
                if(region.getBlockID(coords.x, i, coords.z) == this.id) {
                    this.burn(new Vector3(coords.x, i, coords.z), region, playerUid);
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
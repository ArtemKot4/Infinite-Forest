class ForestMap extends BasicItem implements IItemUseCallback {
    // public static MAP_RENDERMESH: RenderMesh = (() => {
    //     const mesh = new RenderMesh();

    //     mesh.setNormal(0, 1, 0);
	// 	mesh.addVertex(-1, 0, -1, 0, 0);
	// 	mesh.addVertex(1, 0, -1, 1, 0);
	// 	mesh.addVertex(1, 0, 1, 1, 1);
	// 	mesh.addVertex(-1, 0, -1, 0, 0);
	// 	mesh.addVertex(1, 0, 1, 1, 1);
	// 	mesh.addVertex(-1, 0, 1, 0, 1);

    //     mesh.translate(0, 0.2, 0);
    //     mesh.rotate(Math.PI / 2, 0, 0);
    //     return mesh;
    // })()
    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        return window;
    })();
    
    
    public constructor() {
        super("forest_map", {
            name: "map",
            meta: 0
        });
        // const model = ItemModel.getForWithFallback(this.id, 0);
        // model.setHandModel(ForestMap.MAP_RENDERMESH, "items-opaque/forest_map.png");
    }

    public genBitmap(playerUid: number): android.graphics.Bitmap {
        const position = Entity.getPosition(playerUid);
        const bitmap = android.graphics.Bitmap.createBitmap(1024, 1024, android.graphics.Bitmap.Config.ARGB_4444)
        for(let x = position.x; x < position.x + 1024; x++) {
            for(let z = position.z; z < position.z + 1024; z++) {
                const perlin = GenerationUtils.getPerlinNoise(
                    x * 16 + 8,
                    0,
                    z * 16 + 8,
                    1111,
                    1 / 128,
                    2
                );
                bitmap.setPixel(x, z, perlin > (0.7 - 12 / 128) ? android.graphics.Color.blue(perlin) : android.graphics.Color.green(perlin));
            }
        }
        bitmap.setWidth(230);
        bitmap.setHeight(230);
        return bitmap;
    }

    public getContent(playerUid: number): UI.WindowContent {
        return {
            location: {
                x: 500 - 256,
                y: UI.getScreenHeight() / 2 - 128
            },
            drawing: [{
                type: "background", color: android.graphics.Color.TRANSPARENT
            }, {
                type: "bitmap", bitmap: "forest_map", width: 256, height: 256
            }],
            elements: {
                "ground": {
                    type: "image",
                    bitmap: this.genBitmap(playerUid),
                    y: 15,
                    x: 15,
                }
            }
        }
    }

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number):void{//onItemHold(item: ItemInstance, playerUid: number, slotIndex: number): void {
        if(!this.UI.isOpened()) {
            alert("открыто")
            this.UI.setContent(this.getContent(playerUid));
            this.UI.forceRefresh();
            this.UI.open();
        }
    }
}
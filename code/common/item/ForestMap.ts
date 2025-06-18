interface IPaintedBiome {
    curseIcon: string,
    locatorIcon: string,
    color: number
}

class ForestMap extends BasicItem implements IItemHoldCallback {
    public updatableLoaded: boolean = false;
    public static BIOME_SET: Record<string, IPaintedBiome> = {
        firefliesForest: {
            curseIcon: null,
            locatorIcon: null,
            color: android.graphics.Color.argb(255, 21, 124, 0)
        },
        winterForest: {
            curseIcon: "map.winter",
            locatorIcon: null,
            color: android.graphics.Color.argb(255, 91, 161, 206)
        }
    }
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
        const window = new UI.Window({
            location: this.getLocation(),
            drawing: [{
                type: "background", color: android.graphics.Color.TRANSPARENT
            }]
        });
        window.setAsGameOverlay(true);
        window.setTouchable(false);
        return window;
    })();
    
    public constructor() {
        super("forest_map", {
            name: "forest_map",
            meta: 0
        }, {
            stack: 1
        });
        // const model = ItemModel.getForWithFallback(this.id, 0);
        // model.setHandModel(ForestMap.MAP_RENDERMESH, "items-opaque/forest_map.png");
    }

    public recordSurfaceScreen(position: number[], distance: number): void {
        const keyName = "forest_map:" + position[0] + ":" + position[1];
        const bitmap = TextureSource.getNullable(keyName) || android.graphics.Bitmap.createBitmap(distance, distance, android.graphics.Bitmap.Config.ARGB_4444);
        
        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) {
                const pixel = bitmap.getPixel(z, x);
                if(pixel != android.graphics.Color.TRANSPARENT || pixel != android.graphics.Color.GRAY) {
                    continue;
                }

                const perlin = GenerationUtils.getPerlinNoise(
                    (position[0] + x) * 16 + 8,
                    0,
                    (position[1] + z) * 16 + 8,
                    1111,
                    1 / 128,
                    2
                );
                let color = android.graphics.Color.TRANSPARENT;
                const region = BlockSource.getDefaultForDimension(EDimension.INFINITE_FOREST.id);
                if(!region) {
                    return;
                }
                const surface = GenerationUtils.findSurface(position[0] + x, 128, position[1] + z);
                const blockID = region.getBlockID(surface.x, surface.y, surface.z);  
                
                if(blockID != 0) {
                    if(blockID == VanillaBlockID.grass || blockID == VanillaBlockID.tallgrass) {// || Object.keys(AbstractBiome.data[region.getBiome(position.x + x, position.z + z)].getPlantList()).some(v => v.includes(IDRegistry.getStringIdForIntegerId(blockID)))) {
                        if(perlin > (0.7 - 12 / 128)) {
                            color = ForestMap.BIOME_SET.winterForest.color
                            if(Math.random() < 0.001) {
                                this.UI.content.elements[x] = {
                                    type: "image",
                                    bitmap: ForestMap.BIOME_SET.winterForest.curseIcon
                                }
                            }
                        } else {
                            color = ForestMap.BIOME_SET.firefliesForest.color;
                        }
                    } 
                    else if(surface.y == 55) {
                        color = android.graphics.Color.argb(255, 185, 205, 118);
                    }
                    else if(surface.y <= 54) {
                        color = android.graphics.Color.argb(255, 0, 72, 187);
                    }
                } 
                else if((x % 2 == 0 || x % 4 == 0 || x % 6 == 0) && (z % 2 == 0 || z % 4 == 0 || z % 6 == 0)) {
                    color = android.graphics.Color.GRAY;
                }
                bitmap.setPixel(x, z, color);
            }
        }
        TextureSource.put(keyName, bitmap);
    }

    public draw(position: string): void {
        this.UI.setContent(this.getContent(position));
        this.UI.forceRefresh();

        if(!this.UI.isOpened()) {
            this.UI.open();
        }
    }

    public startUpdatable(playerUid: number, mapInstance: ItemInstance): void {
        if(this.updatableLoaded) {
            return;
        }
        
        this.updatableLoaded = true;
        const self = this;
        const positionData = mapInstance.extra.getString("position").split(":").map(v => Number(v));
        const mapDistance = mapInstance.extra.getInt("distance", 128);

        Updatable.addLocalUpdatable({
            update() {
                const time = World.getThreadTime();
                if(time % 5 == 0) {
                    const item = Entity.getCarriedItem(playerUid);
                    if(time % 45 == 0) {
                        const position = Entity.getPosition(playerUid);
                        if(
                            (position.x >= positionData[0] + mapDistance / 2) && 
                            (position.x <= positionData[0] + mapDistance / 2) &&
                            (position.z >= positionData[1] + mapDistance / 2) &&
                            (position.z <= positionData[1] + mapDistance / 2)
                        ) {
                            self.draw(mapInstance.extra.getString("position"));
                        }
                    }
                    if(item.id != self.id) {
                        self.updatableLoaded = false;
                        self.UI.close();
                        this.remove = true;
                        return;
                    }
                }
            }
        });
    }

    public getSize(): number {
        return 305;
    }

    public getLocation(): UI.WindowLocationParams {
        const size = this.getSize();

        return {
            x: 500-size/2,
            y: UI.getScreenHeight() / 2 - (108 + 20),
            width: size,
            height: size + 20
        }
    }

    public getContent(position: string): UI.WindowContent {
        return {
            location: this.getLocation(),
            drawing: [{
                type: "background", color: android.graphics.Color.TRANSPARENT
            }, {
                type: "bitmap", bitmap: "forest_map", width: 1000, height: 1000, y: 17
            }, {
                type: "text", text: Translation.translate("message.infinite_forest.coords_vine") + "["+InfiniteForest.data.vinePos[0]+", " + InfiniteForest.data.vinePos[1] + "]", 
                font: {
                    color: android.graphics.Color.GREEN,
                    size: 40
                },
                x: 0,
                y: 0
            }],
            elements: {
                ground: {
                    type: "image",
                    bitmap: "forest_map:" + position,
                    y: 77,
                    x: 60,
                    width: 880,
                    height: 880
                }
            }
        }
    }

    public onItemHold(item: ItemInstance, playerUid: number, slotIndex: number): void {
        if(!item.extra || item.extra && !item.extra.getString("position")) {
            this.recordData(playerUid);
        }
        item = Entity.getCarriedItem(playerUid);
        this.startUpdatable(playerUid, item);

        const positionKey = item.extra.getString("position");
        const positionData = item.extra.getString("position").split(":").map(v => Number(v));
        
        this.recordSurfaceScreen(positionData, item.extra.getInt("distance", 128));
        if(!this.UI.isOpened()) {
            this.UI.setContent(this.getContent(positionKey));
            this.UI.open();
        }
    }

    public recordData(playerUid: number): void {
        const position = Entity.getPosition(playerUid);
        const extra = new ItemExtraData();

        extra.putString("position", position.x + ":" + position.z);
        extra.putInt("distance", 128);
        Entity.setCarriedItem(playerUid, this.id, 1, 0, extra);
    }
}

Translation.addTranslation("message.infinite_forest.coords_vine", {
    ru: "Расположение стебля: ",
    en: "Vine location: "
});
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
            curseIcon: "map.tree",
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
        const window = new UI.Window(this.getDefaultContent());
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

    public onItemHold(item: ItemInstance, playerUid: number, slotIndex: number): void {
        if(!item.extra || item.extra && !item.extra.getString("position")) {
            this.recordData(playerUid);
        }
        item = Entity.getCarriedItem(playerUid);
        this.startUpdatable(playerUid, item);

        const positionKey = item.extra.getString("position");
        const positionData = item.extra.getString("position").split(":").map(v => Number(v));
        
        this.recordSurfaceScreen(positionData, item.extra.getInt("distance", 128));
        this.updateGround(positionKey);
        if(!this.UI.isOpened()) {
            this.UI.content.elements.text.text = Translation.translate("message.infinite_forest.coords_vine") + "["+(InfiniteForest.data.vinePos[0]||"?")+", " + (InfiniteForest.data.vinePos[1]||"?") + "]";
            this.UI.open();
        }
    }

    public getEmptyGrid(distance: number): android.graphics.Bitmap {
        const bitmap = android.graphics.Bitmap.createBitmap(distance, distance, android.graphics.Bitmap.Config.ARGB_4444);
        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) { 
                if((x % 2 == 0 || x % 4 == 0 || x % 6 == 0) && (z % 2 == 0 || z % 4 == 0 || z % 6 == 0)) {
                    bitmap.setPixel(x, z, android.graphics.Color.GRAY);
                }
            }
        }
        return bitmap;
    }

    public recordSurfaceScreen(position: number[], distance: number): void {
        const keyName = "forest_map:" + position[0] + ":" + position[1];
        const bitmap = TextureSource.getNullable(keyName) || this.getEmptyGrid(distance);
        const signs = {};

        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) { 
                const perlin = GenerationUtils.getPerlinNoise(
                    (position[0] + x) * 16 + 8,
                    0,
                    (position[1] + z) * 16 + 8,
                    1111,
                    1 / 128,
                    2
                );
                const region = BlockSource.getDefaultForDimension(EDimension.INFINITE_FOREST.id);
                if(!region) {
                    return;
                }
                let color = bitmap.getPixel(z, x);
                const surface = GenerationUtils.findSurface(position[0] + x, 128, position[1] + z);
                const blockID = region.getBlockID(surface.x, surface.y, surface.z);  
            
                if((color == 0 || color == android.graphics.Color.GRAY) && blockID != 0) {
                    if(blockID == VanillaBlockID.grass || blockID == VanillaBlockID.tallgrass) {// || Object.keys(AbstractBiome.data[region.getBiome(position.x + x, position.z + z)].getPlantList()).some(v => v.includes(IDRegistry.getStringIdForIntegerId(blockID)))) {
                        if(surface.y != 0 && perlin > (0.7 - 12 / 128)) {
                            color = ForestMap.BIOME_SET.winterForest.color;
                            if(Math.random() < 0.02) {
                                const screenX = (x - bitmap.getWidth() / 2) * 1000 / bitmap.getWidth();
                                const screenY = (z - bitmap.getHeight() / 2) * 1000 / bitmap.getHeight();
                        
                                signs[x] = {
                                    x: screenX,
                                    y: screenY,
                                    type: "image",
                                    bitmap: ForestMap.BIOME_SET.winterForest.curseIcon,
                                    width: 16 * 4,
                                    height: 16 * 4
                                }
                            }
                        } else {
                            color = ForestMap.BIOME_SET.firefliesForest.color;
                        }
                    } 
                    else if(surface.y == 55) {
                        color = android.graphics.Color.argb(255, 185, 205, 118);
                    }
                    else if(surface.y != 0 && surface.y <= 54) {
                        color = android.graphics.Color.argb(255, 0, 72, 187);
                    }
                }
                bitmap.setPixel(x, z, color);
            }
        }
        TextureSource.put(keyName, bitmap);
        this.UI.content.elements = Object.assign({}, signs, this.UI.content.elements);
    }

    public draw(position: string): void {
        this.updateGround(position);
        if(!this.UI.isOpened()) {
            this.UI.setContent(this.getDefaultContent());
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
                const item = Entity.getCarriedItem(playerUid);
                if(time % 45 == 0) {
                    const position = Entity.getPosition(playerUid);
                    if(
                        (position.x >= positionData[0] + mapDistance) && 
                        (position.x <= positionData[0] + mapDistance) &&
                        (position.z >= positionData[1] + mapDistance) &&
                        (position.z <= positionData[1] + mapDistance)
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
        });
    }

    public getSize(): number {
        return 305;
    }

    public getDefaultContent(): UI.WindowContent {
        return (
            {
            location: this.getLocation(),
            drawing: [{
                    type: "background", color: android.graphics.Color.TRANSPARENT
                }, {
                    type: "bitmap", bitmap: "forest_map", width: 1000, height: 1000, y: 47
                }],
                elements: {
                    text: {
                        type: "text", 
                        font: {
                            color: android.graphics.Color.WHITE,
                            shadow: 0.25,
                            size: 40
                        },
                        x: 0,
                        y: 15
                    },
                    ground: {
                        type: "image",
                        bitmap: "unknown",
                        y: 107,
                        x: 60,
                        width: 880,
                        height: 880
                    }
                }
            }
        );
    }

    public getLocation(): UI.WindowLocationParams {
        const size = this.getSize();

        return {
            x: 500-size/2,
            y: UI.getScreenHeight() / 2 - (108 + 50),
            width: size,
            height: size + 50
        }
    }

    public recordData(playerUid: number): void {
        const position = Entity.getPosition(playerUid);
        const extra = new ItemExtraData();

        extra.putString("position", position.x + ":" + position.z);
        extra.putInt("distance", 128);
        Entity.setCarriedItem(playerUid, this.id, 1, 0, extra);
    }

    public updateGround(positionKey: string) {
        this.UI.content.elements.ground.bitmap = "forest_map:"+positionKey;
        this.UI.forceRefresh();
    }

    public getName(): string {
        return "item.infinite_forest.forest_map";
    }
}

Translation.addTranslation("message.infinite_forest.coords_vine", {
    ru: "Расположение стебля: ",
    en: "Vine location: "
});
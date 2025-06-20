interface IPaintedBiome {
    curseIcon: string,
    locatorIcon: string,
    color: number
}

class ForestMap extends BasicItem implements IItemHoldCallback, INameOverrideCallback {
    public static BIOME_ICON_SIZE: number = 128;
    public static APPEAR_SPEED: number = 1;

    public threadLoaded: boolean = false;
    public height: number = 0;
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
        ItemModel.getForWithFallback(this.id, 0).setHandModel(new RenderMesh());
    }

    public onNameOverride(item: ItemInstance, translation: string, name: string): string | void {
        return Translation.translate(name) + "\n" + Native.Color.GRAY + Translation.translate("message.infinite_forest.map_distance") + " " + ((item.extra && item.extra.getInt("distance")) || 128);
    }

    public onItemHold(item: ItemInstance, playerUid: number, slotIndex: number): void {
        if(RuntimeData.local.screenName != EScreenName.IN_GAME_PLAY_SCREEN) {
            if(this.UI.isOpened()) {
                this.UI.close();
            }
            return;
        }

        if(!item.extra || item.extra && !item.extra.getString("position")) {
            this.recordData(playerUid, item);
        }
        item = Entity.getCarriedItem(playerUid);

        const positionKey = item.extra.getString("position");
        const distance = item.extra.getInt("distance", 128);
        
        if(!this.UI.isOpened()) {
            this.UI.content.elements.text.text = Translation.translate("message.infinite_forest.coords_vine") + "["+(Math.floor(InfiniteForest.data.vinePos[0])||"?")+", " + (Math.floor(InfiniteForest.data.vinePos[1])||"?") + "]";
            this.height = UI.getScreenHeight() * 2.5;

            this.updateHeight();
            this.recordSurfaceScreen(positionKey.split(":").map(v => Number(v)), distance);
            this.updateGround(positionKey);
            this.UI.open();
        }
        this.startThread(playerUid);
    }

    public startThread(playerUid: number): void {
        if(!this.UI.isOpened() || this.threadLoaded) {
            return;
        }
        
        this.threadLoaded = true;

        let sleepTime = ForestMap.APPEAR_SPEED;
        Threading.initThread("thread.infinite_forest.forest_map", () => {
            while(true) {
                java.lang.Thread.sleep(sleepTime);
                if(!this.UI.isOpened()) {
                    sleepTime = ForestMap.APPEAR_SPEED;
                    continue;
                }

                const item = Entity.getCarriedItem(playerUid);

                if(item.id == this.id) {
                    if(this.height > this.getLocation().y - 50) {
                        this.height -= 4;
                        this.updateHeight();
                    } else {
                        sleepTime = 500;

                        const positionData = item.extra.getString("position").split(":").map(v => Number(v));
                        const mapDistance = item.extra.getInt("distance", 128);

                        this.recordSurfaceScreen(positionData, mapDistance);
                        this.updateGround(item.extra.getString("position")); 
                        // const position = Entity.getPosition(playerUid);
                        // if(
                        //     (position.x >= positionData[0] + mapDistance) && 
                        //     (position.x <= positionData[0] + mapDistance) &&
                        //     (position.z >= positionData[1] + mapDistance) &&
                        //     (position.z <= positionData[1] + mapDistance)
                        // ) {
                        //     Game.message("pererisovano")
                            
                        //     this.UI.forceRefresh();
                        // }
                    }
                } else {
                    sleepTime = ForestMap.APPEAR_SPEED;
                    if(this.height < UI.getScreenHeight() * 2.5) {
                        this.height += 4;
                        this.updateHeight();
                    } else {
                        this.threadLoaded = false;
                        this.UI.close();
                        return;
                    }
                }
            }
        });
    }

    public getEmptyGrid(distance: number): android.graphics.Bitmap {
        const bitmap = android.graphics.Bitmap.createBitmap(distance, distance, android.graphics.Bitmap.Config.ARGB_4444);
        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) { 
                if((x % 2 == 0) && (z % 2 == 0)) {
                    bitmap.setPixel(x, z, android.graphics.Color.GRAY);
                }
            }
        }
        return bitmap;
    }

    public recordSurfaceScreen(position: number[], distance: number): void {
        const keyName = "forest_map:" + position[0] + ":" + position[1];
        const bitmap = TextureSource.getNullable(keyName) || this.getEmptyGrid(distance);
        const signsData = [];

        position[0] = position[0] - distance / 2;
        position[1] = position[1] - distance / 2;
        
        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) { 
                //const perlin = GenerationUtils.getPerlinNoise(
                //     (position[0] + x) * 16,
                //     0,
                //     (position[1] + z) * 16,
                //     0,
                //     1 / 128,
                //     3
                // );
                const region = BlockSource.getDefaultForDimension(EDimension.INFINITE_FOREST.id);
                if(!region) {
                    TextureSource.put(keyName, bitmap);
                    return;
                }
                let color = bitmap.getPixel(z, x);
                const surface = GenerationUtils.findSurface(position[0] + x, 128, position[1] + z);
                const biome = region.getBiome(position[0] + x, position[1] + z);
                const biomeData = AbstractForestBiome.getFor(biome);
                const blockID = region.getBlockID(surface.x, surface.y, surface.z);
                if((color == 0 || color == android.graphics.Color.GRAY) && biomeData != null) {
                    //color = android.graphics.Color.rgb(mapColor[0] * perlin, mapColor[1] * perlin, mapColor[2] * perlin);
                    if(surface.y > 0 && surface.y <= 54 && blockID != 0) {
                        color = android.graphics.Color.rgb(0, 72, 187)
                        //color = android.graphics.Color.rgb(0, 72 * (perlin * 2), 187 * (perlin * 2));
                    } 
                    else if(surface.y == 55 //&& 
                        // (
                        //     blockID == VanillaBlockID.sand || 
                        //     blockID == VanillaBlockID.cactus || 
                        //     blockID == VanillaBlockID.deadbush ||
                        //     blockID == VanillaBlockID.reeds
                        // )
                    ) {
                        color = android.graphics.Color.rgb(185, 205, 118);
                    } else {
                        if(!AbstractForestBiome.isExists(biome)) {
                            continue;
                        }
                        if("sign" in biomeData && Math.random() < 0.002) {
                            const lastSign = signsData[signsData.length - 1];
                            if(!lastSign || (lastSign && (lastSign[0] > x + 20 || lastSign[0] < x - 20))) {// && (lastSign[1] > z + 20 || lastSign[1] < z - 20))) {
                                signsData.push([x, z, biomeData.sign]);
                            }
                        }
                        const mapColor = biomeData.getMapColor();
                        color = android.graphics.Color.rgb(mapColor[0], mapColor[1], mapColor[2]);
                    // else if(blockID == VanillaBlockID.leaves || blockID == VanillaBlockID.leaves2) {
                    //     color = android.graphics.Color.rgb(0, 102 + ((surface.y - 55) * 10), 0);
                    // }
                    }
                    const pixelOffset = [[x + 1, z], [x, z + 1], [x - 1, z], [x, z - 1]];
                    pixelOffset.forEach(v => {
                        if(v[0] > 0 && v[1] > 0 && v[0] < bitmap.getWidth() && v[1] < bitmap.getHeight()) {
                            const previousBiome = region.getBiome(position[0] + v[0], position[1] + v[1]);
                            if(AbstractForestBiome.isExists(previousBiome) && previousBiome != biome) {
                                color = android.graphics.Color.BLACK;
                            }
                        }
                        
                    });
                } 
                bitmap.setPixel(x, z, color);
            }
        }
        for(const i in signsData) {
            this.putSignToBitmap(bitmap, signsData[i][0], signsData[i][1], signsData[i][2]);
        } 
        TextureSource.put(keyName, bitmap);
    }

    public putSignToBitmap(bitmap: android.graphics.Bitmap, posX: number, posZ: number, icon: string): void {
        let iconBitmap = TextureSource.getNullable(icon);
        if(!iconBitmap) {
            alert(icon + " is not exists!");
            return;
        }
        //iconBitmap = android.graphics.Bitmap.createScaledBitmap(iconBitmap, 64, 64, false);
        
        for(let x = 0; x < iconBitmap.getWidth(); x++) {
            for(let z = 0; z < iconBitmap.getHeight(); z++) { 
                const pixel = iconBitmap.getPixel(x, z);
                if(pixel == android.graphics.Color.TRANSPARENT) {
                    continue;
                }
                if(posX + x < bitmap.getWidth() && posZ + z < bitmap.getHeight()) {
                    bitmap.setPixel(posX + x, posZ + z, pixel);
                }
            }
        }
    }

    public draw(position: string): void {
        this.updateGround(position);
        if(RuntimeData.local.screenName == EScreenName.IN_GAME_PLAY_SCREEN && !this.UI.isOpened()) {
            this.UI.open();
        }
    }

    public updateHeight(): void {
        const elements = this.UI.getElements();
        const background = elements.get("background");
        const ground = elements.get("ground");
        const text = elements.get("text");

        background.setPosition(0, this.height + 47);
        ground.setPosition(60, this.height + 107);
        text.setPosition(0, this.height + 15);
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
                }],
                elements: {
                    background: {
                        type: "image", 
                        bitmap: "forest_map", 
                        width: 1000, 
                        height: 1000, 
                        y: 47
                    },
                    ground: {
                        type: "image",
                        bitmap: "unknown",
                        y: 107,
                        x: 60,
                        width: 880,
                        height: 880
                    },
                    text: {
                        type: "text", 
                        font: {
                            color: android.graphics.Color.WHITE,
                            shadow: 0.25,
                            size: 40
                        },
                        x: 0,
                        y: 15
                    }
                }
            }
        );
    }

    public getLocation(): UI.WindowLocationParams {
        const screenHeight = UI.getScreenHeight();
        const size = this.getSize();

        return {
            x: 500-size/2,
            y: screenHeight / 2 - (108 + 50),
            width: size
        }
    }

    public recordData(playerUid: number, item: ItemInstance): void {
        const position = Entity.getPosition(playerUid);
        const extra = new ItemExtraData();

        extra.putString("position", position.x + ":" + position.z); 
        extra.putInt("distance", item.extra ? item.extra.getInt("distance", 128) : 128);
        Entity.setCarriedItem(playerUid, this.id, 1, 0, extra);
    }

    public updateGround(positionKey: string) {
        this.UI.content.elements.ground.bitmap = "forest_map:" + positionKey;
    }

    public getName(): string {
        return "item.infinite_forest.forest_map";
    }
}


Translation.addTranslation("message.infinite_forest.coords_vine", {
    ru: "Расположение стебля: ",
    en: "Vine location: "
});


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

Translation.addTranslation("message.infinite_forest.map_distance", {
    ru: "Размер:",
    en: "Distance:"
});
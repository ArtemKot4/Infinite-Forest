abstract class MapBase {
    public abstract readonly DEFAULT_DISTANCE;
    public readonly APPEAR_SPEED: number = 1;
    
    public shift: number = 64;
    public height: number = 0;
    public UI: UI.Window = (() => {
        const window = new UI.Window(this.getDefaultContent());
        window.setAsGameOverlay(true);
        window.setTouchable(false);
        return window;
    })();
    public threadLoaded: boolean = false;
    
    public constructor(public id: number) {};

    public updateLocator(positionData: number[], playerUid: number): void {
        const playerPosition = Entity.getPosition(playerUid); 
        const x = positionData[0] - playerPosition.x;
        const z = positionData[1] - playerPosition.z;
        const locator = this.UI.getElements().get("locator");

        locator.setPosition(107 + Math.min(880, x), 60 + Math.min(880, z));
    }

    public startThread(playerUid: number): void {
        if(!this.UI.isOpened() || this.threadLoaded) {
            return;
        }
        
        this.threadLoaded = true;

        let sleepTime = this.APPEAR_SPEED;
        Threading.initThread("thread.infinite_forest.forest_map", () => {
            while(true) {
                java.lang.Thread.sleep(sleepTime);
                if(!this.UI.isOpened()) {
                    sleepTime = this.APPEAR_SPEED;
                    continue;
                }

                const item = Entity.getCarriedItem(playerUid);

                if(item.id == this.id) {
                    if(this.height > this.getLocation().y - 50) {
                        this.height -= 4;
                        this.updateHeight();
                    } else { 
                        const positionKey = item.extra.getString("position");
                        const positionData = positionKey.split(":").map(v => Number(v));
                        const distance = item.extra.getInt("distance", 128);
                        sleepTime = 500 * ((distance / 128) || 1);
                        
                        this.shift = Math.min(distance, this.shift + 16);
  
                        this.putSurfaceScreen(positionData, distance);
                        this.updateGround(positionKey); 
                        this.updateLocator(positionData, playerUid);

                        if(this.shift >= distance) {
                            this.shift = 64;
                        }
                    }
                } else {
                    sleepTime = this.APPEAR_SPEED;
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
        const bitmap = android.graphics.Bitmap.createBitmap(128, 128, android.graphics.Bitmap.Config.ARGB_4444);
        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < bitmap.getWidth(); z++) { 
                if((x % 2 == 0) && (z % 2 == 0)) {
                    bitmap.setPixel(x, z, android.graphics.Color.GRAY);
                }
            }
        }
        return android.graphics.Bitmap.createScaledBitmap(bitmap, distance, distance, false);
    }

    abstract getSurfaceScreen(position: number[], distance: number): android.graphics.Bitmap;

    public putSurfaceScreen(position: number[], distance: number): void {
        TextureSource.put(this.id + "_" + "map:" + position[0] + ":" + position[1], this.getSurfaceScreen(position, distance));
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
                    },
                    locator: {
                        type: "image",
                        bitmap: "map.locator",
                        x: 107 + 880 / 2,
                        y: 60 + 880 / 2,
                        scale: 3
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

    public getFormattedKey(positionKey: string): string {
        return this.id + "_" + "map:" + positionKey;
    }

    public hasGroundPicture(positionKey: string): boolean {
        return TextureSource.getNullable(this.getFormattedKey(positionKey)) != null;
    }

    public open(distance: number, positionKey: string, positionData: number[], playerUid: number): void {
        if(RuntimeData.local.screenName != EScreenName.IN_GAME_PLAY_SCREEN) {
            if(this.UI.isOpened()) {
                this.UI.close();
            }
            return;
        }

        // if(!item.extra || item.extra && !item.extra.getString("position")) {
        //     this.recordData(playerUid, item);
        // }
        // item = Entity.getCarriedItem(playerUid);

        // const positionKey = item.extra.getString("position");
        // const distance = item.extra.getInt("distance", 128);
        
        if(!this.UI.isOpened()) {
            this.UI.content.elements.text.text = Translation.translate("message.infinite_forest.coords_vine") + " " + "["+(Math.floor(InfiniteForest.data.vinePos[0])||"?")+", " + (Math.floor(InfiniteForest.data.vinePos[1])||"?") + "]";
            this.height = UI.getScreenHeight() * 2.5;

            this.updateHeight();
            if(!this.hasGroundPicture(positionKey)) {
                this.putSurfaceScreen(positionData, distance);
            }
            this.updateGround(positionKey);
            this.UI.open();
        }
        this.startThread(playerUid);
    }

    public updateGround(positionKey: string): void {
        this.UI.content.elements.ground.bitmap = this.getFormattedKey(positionKey);
    }
}
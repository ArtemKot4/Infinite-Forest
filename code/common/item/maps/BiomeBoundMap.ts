class BiomeBoundMap extends MapBase {
    public readonly DEFAULT_DISTANCE: number = 256;
    public readonly BIOME_ICON_SIZE: number = 16;

    public override getSurfaceScreen(position: number[], distance: number): android.graphics.Bitmap {
        const bitmap = TextureSource.getNullable(this.id + "_" + "map:" + position[0] + ":" + position[1]) || this.getEmptyGrid(distance);
        const signsData = [];

        position[0] = position[0] - distance / 2;
        position[1] = position[1] - distance / 2;
        
        const region = BlockSource.getDefaultForDimension(EDimension.INFINITE_FOREST.id);
        if(!region) {
            return bitmap;
        }

        for(let x = 0; x < bitmap.getHeight(); x++) {
            for(let z = 0; z < this.shift; z++) {//bitmap.getWidth(); z++) { 
                let color = bitmap.getPixel(z, x);
                const biome = region.getBiome(position[0] + x, position[1] + z);
                const biomeData = AbstractForestBiome.getFor(biome);
                if((color == 0 || color == android.graphics.Color.GRAY) && biomeData != null) {
                    if(!AbstractForestBiome.isExists(biome)) {
                        continue;
                    }
                    if("sign" in biomeData && Math.random() < 0.0095) {
                        const lastSign = signsData[signsData.length - 1];
                        if(!lastSign || (lastSign && (lastSign[0] > x + 20 || lastSign[0] < x - 20))) {// && (lastSign[1] > z + 20 || lastSign[1] < z - 20))) {
                            signsData.push([x, z, biomeData.sign]);
                        }
                    }
                    const mapColor = biomeData.getMapColor();
                    color = android.graphics.Color.rgb(mapColor[0], mapColor[1], mapColor[2]);
                    const pixelOffset = [[x + 1, z], [x, z + 1], [x - 1, z], [x, z - 1]];
                    pixelOffset.forEach(v => {
                        if(v[0] >= 0 && v[1] >= 0 && v[0] <= bitmap.getWidth() && v[1] <= bitmap.getHeight()) {
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
        return bitmap;
    }

    public putSignToBitmap(bitmap: android.graphics.Bitmap, posX: number, posZ: number, icon: string): void {
        let iconBitmap = TextureSource.getNullable(icon);
        if(!iconBitmap) {
            alert(icon + " is not exists!");
            return;
        }
        
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
}
namespace TileSignRenderer {
    export let x = 0;
    export let y = 0;
    export let z = 0;
    export let renders: RotatingRenderFX[] = [];

    export function hasSign(pos: Vector): boolean {
        return x == pos.x && y == pos.y && z == pos.z;
    }

    export function setPosition(newX: number, newY: number, newZ: number): void {
        x = newX;
        y = newY;
        z = newZ;
    }

    export function clearFXs(): void {
        if(renders.length > 0) {
            renders.forEach(v => v.destroy());
        }
    }

    export function startFXs(fxs: RotatingRenderFX[]): void {
        if(fxs.length > 0) {
            renders = fxs;
            renders.forEach(v => v.load());
        }
        return;
    }

    export function startFXsByPosition(x: number, y: number, z: number, renders?: RotatingRenderFX[]): void {
        clearFXs();
        setPosition(x, y, z);    
        startFXs(renders || getRendersFrom(x, y, z));
    }

    export function getFXsForItemId(itemID: number, x: number, y: number, z: number, startHeight?: number): RotatingRenderFX[] {
        const signs = Sign.getFrom(itemID);
        const addX = 0.7 - Number("0." + signs.length * 2);

        return signs.map((v, i) => {
            const offset = Number(i);

            const render = new RotatingRenderFX({
                x: x + addX + Number("0." + (offset == 0 ? 0 : offset + 3)),//x,
                y: y,
                z: z + 0.5,
                skin: Sign.get(v).icon,
                //x2: x + addX + Number("0." + (offset == 0 ? 0 : offset + 3)),
                startHeight: startHeight || 0
            });
            return render;
        });
    }

    export function getFXsForSlots(slots: ItemInstance[], x: number, y: number, z: number): RotatingRenderFX[] {
        let renders: RotatingRenderFX[] = [];
        let offset = 0;

        for(const i in slots) {
            const slot = slots[i];
            if(slot.id != 0) {
                renders = renders.concat(getFXsForItemId(
                    slot.id, 
                    x, 
                    y + Number("0." + offset), 
                    z,
                    Number("0." + (offset == 0 ? 0 : offset))
                ));
                offset += 3;
            }
        }
        return renders;
    }

    export function getRendersFrom(x: number, y: number, z: number): RotatingRenderFX[] {
        const tile = TileEntity.getTileEntity(x, y, z);
        let renders: RotatingRenderFX[] = [];

        if(tile != null) {
            const id = tile.data.item instanceof Object ? tile.data.item.id : tile.data.id;
            if(id != null) {
                const signs = Sign.getFrom(id);

                if(signs.length > 0) {                        
                    renders = getFXsForItemId(id, x, y, z);
                }
            } else if(Object.keys(tile.container.slots).length > 0){
                renders = getFXsForSlots(Object.values(tile.container.slots), x, y, z);
            }
        } else {
            const nativeTile = BlockSource.getCurrentClientRegion().getBlockEntity(x, y, z);
            if(nativeTile != null) {
                const slots: ItemInstance[] = [];
                for(let i = 0; i < nativeTile.getSize(); i++) {
                    const slot = nativeTile.getSlot(i);
                    if(slot.id != 0) {
                        slots.push(nativeTile.getSlot(i));
                    }
                }
                renders = getFXsForSlots(slots, x, y, z);
            }
        }
        return renders;
    }

    export function renderEquals(fxBefore: RotatingRenderFX[], fxNew: RotatingRenderFX[]): boolean {
        if(fxBefore.length != fxNew.length) {
            return false;
        }
        for(const i in fxNew) {
            if(fxBefore[i].skin != fxNew[i].skin) {
                return false;
            }
        }
        return true;
    }
    
    export function renderByPointed(block: Tile, position: BlockPosition, vector: Vector): void {
        const time = World.getThreadTime();
        const isUsing = hasSign(position);
        if(time % 20 == 0) {
            if(!isUsing || isUsing && renders.length == 0) {
                startFXsByPosition(position.x, position.y, position.z);
            } else if(time % 40 == 0 && isUsing && renders.length > 0) {
                const newRenders = getRendersFrom(position.x, position.y, position.z);
                if(renderEquals(renders, newRenders) == false) {
                    startFXsByPosition(position.x, position.y, position.z, newRenders);
                }
            }
        } 
    }
    Callback.addCallback("BlockSelection", renderByPointed);
}
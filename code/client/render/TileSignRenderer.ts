namespace TileSignRenderer {
    export let x = 0;
    export let y = 0;
    export let z = 0;
    export let renders: RotatingRenderFX[] = [];

    export function hasSign(pos: Vector): boolean {
        return x == pos.x && y == pos.y && z == pos.z;
    }

    export function clearFXs(): void {
        if(renders.length > 0) {
            renders.forEach(v => v.destroy());
        }
    }

    export function setFXs(fxs: RotatingRenderFX[]): void {
        if(fxs.length > 0) {
            renders = fxs;
            renders.forEach(v => v.start());
        }
        return;
    }

    export function getFXsForItemId(itemID: number, x: number, y: number, z: number): RotatingRenderFX[] {
        let signs = Sign.getFrom(itemID);
        const addX = 0.7 - Number("0." + signs.length * 2);

        return signs.map((v, i) => {
            const offset = Number(i);

            const render = new RotatingRenderFX(
                x + addX + Number("0." + (offset == 0 ? 0 : offset + 3)), 
                y, 
                z + 0.5, 
                Sign.get(v).icon
            );
            return render;
        });
    }

    export function getFXsForSlots(slots: ItemInstance[], x: number, y: number, z: number): RotatingRenderFX[] {
        let renders: RotatingRenderFX[] = [];
        let offset = 0;

        for(const i in slots) {
            const slot = slots[i];
            if(slot.id != 0) {
                renders = renders.concat(getFXsForItemId(slot.id, x, y + Number("0." + offset), z))
                offset+=3;
            }
        }
        return renders;
    }

    export function getRendersFrom(x: number, y: number, z: number): RotatingRenderFX[] {
        const tile = TileEntity.getTileEntity(x, y, z);
        let renders: RotatingRenderFX[] = [];

        if(tile != null) {
            if("id" in tile.data && tile.data.id != 0) {
                let signs = Sign.getFrom(tile.data.id);

                if(signs.length > 0) {                        
                    renders = getFXsForItemId(tile.data.id, x, y, z);
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
    
    export function renderByPointed(): void {
        const data = Player.getPointed();

        if(!hasSign(data.pos)) {
            clearFXs();
            x = data.pos.x;
            y = data.pos.y;
            z = data.pos.z;       
            setFXs(getRendersFrom(data.pos.x, data.pos.y, data.pos.z));
        } 
    }
}
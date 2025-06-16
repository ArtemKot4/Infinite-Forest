class LocalMortarTile extends LocalTileEntity {
    public static ITEM_POSITION = 0.08;
    public static PESTLE_RENDERMESH: RenderMesh = (() => {
        const mesh = new RenderMesh();
        mesh.importFromFile(modelsdir + "block/pestle.obj", "obj", {
            invertV: false,
            noRebuild: false
        });
        return mesh;
    })();
    public itemAnimation: Animation.Item;
    public pestleAnimation: Animation.Base;

    @NetworkEvent
    public create_pestle_render(): void {
        if(!this.pestleAnimation) {
            this.pestleAnimation = new Animation.Base(this.x + 0.5, this.y + 0.09, this.z + 0.5);
            this.pestleAnimation.describe({
                mesh: LocalMortarTile.PESTLE_RENDERMESH, skin: "terrain-atlas/mortar/pestle.png"
            });
            this.pestleAnimation.load();
        }
    }

    @NetworkEvent
    public create_item_render(item: ItemInstance): void {
        if(!this.itemAnimation) {
            this.itemAnimation = new Animation.Item(this.x + 0.5, this.y + LocalMortarTile.ITEM_POSITION, this.z + 0.5);
        }
        
        this.itemAnimation.describeItem({
            id: item ? Network.serverToLocalId(item.id) : 0,
            count: 1,
            data: 0,
            size: 0.28,
            rotation: [Math.PI / 2, 0, 0]
        });

        if(this.networkData.getInt("item") == 0 && this.networkData.getBoolean("pestle") == false) {
            this.startFallAnimation();
            return;
        }
        this.itemAnimation.load();
    }

    public startFallAnimation(): void {
        let height = MathHelper.randomFrom(0.6, 0.7, 0.8);
        let speed = 0.005;

        this.itemAnimation.setPos(this.x + 0.5, this.y + height, this.z + 0.5);
        this.itemAnimation.load();

        Threading.initThread("thread.infinite_forest.item_fall", () => {
            while(true) {
                java.lang.Thread.sleep(65);
                if(height > 0) {
                    height = Math.max(0, height - (speed += 0.001));
                    
                    this.itemAnimation.setPos(this.x + 0.5, this.y + LocalMortarTile.ITEM_POSITION + height, this.z + 0.5);
                } else {
                    return;
                }
            }
        });
    }

    public getTime(): number {
        return this.networkData.getInt("time", 0);
    }

    public onLoad(): void {
        if(this.networkData.getBoolean("pestle") == true) {
            this.create_pestle_render();
        }

        const itemId = this.networkData.getInt("item");

        if(itemId != 0) {
            this.create_item_render(new ItemStack(itemId, 1, 0));
        }
    }

    public onUnload(): void {
        if(this.pestleAnimation) {
            this.pestleAnimation.destroy();
        }

        if(this.itemAnimation) {
            this.itemAnimation.destroy();
        }
    }

    public onTick(): void {
        const time = this.getTime();
        const item = Network.serverToLocalId(this.networkData.getInt("item"));
        if(item != 0 && this.getTime() > 0 && this.pestleAnimation) {
            this.pestleAnimation.transform().rotate(0, 0.05, 0);
            if(time % 20 == 0 && this.itemAnimation) {
                this.itemAnimation.setItemRotation(0, Math.PI / MathHelper.randomFrom(2, 4, 6), 0);
            }
            for(let i = 0; i < 3; i++) {
                Particles.addBreakingItemParticle(
                    item, 
                    0, 
                    this.x + MathHelper.randomFrom(0.4, 0.5, 0.6), 
                    this.y + 0.05, 
                    this.z + MathHelper.randomFrom(0.4, 0.5, 0.6)
                );
            }
        }
    }
}
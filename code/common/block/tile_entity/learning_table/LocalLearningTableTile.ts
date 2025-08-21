class LocalLearningTableTile extends LocalTileEntity {
    public signRenders: RotatingRenderFX[];
    public animation: Animation.Item;

    public onLoad(): void {
        this.create_animation();
        this.set_sign_renders();
    }

    public onUnload(): void {
        if(this.animation) {
            this.animation.destroy();
            this.clearSignRenders();
        }
    }

    public clearSignRenders(): void {
        this.signRenders.forEach(v => v.destroy());
        this.signRenders = [];
    }

    @NetworkEvent
    public set_sign_renders(): void {
        this.signRenders = this.signRenders || [];
        // const itemID = Network.localToServerId(this.networkData.getInt("itemID", 0));
        // if(itemID == 0) {
        //     this.clearSignRenders();
        //     return;
        // }
        // const signs = Sign.getFrom(itemID);
        // const x = 0.7 - Number("0."+signs.length*2);

        // for(const i in signs) {
        //     const offset = Number(i);

        //     const render = new RotatingRenderFX(this.x + x + Number("0." + (offset == 0 ? 0 : offset + 3)), this.y, this.z + 0.5, Sign.get(signs[i]).icon);
        //     render.start();
        //     this.signRenders.push(render);
        // }
    }

    @NetworkEvent
    public create_animation(): void {
        const itemID = Network.localToServerId(this.networkData.getInt("itemID", 0));
        if(itemID != 0 && !this.animation) {
            const animationX = this.networkData.getFloat("animationX", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
            const animationZ = this.networkData.getFloat("animationZ", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
            const rotation = this.networkData.getFloat("rotation", MathHelper.radian(MathHelper.randomInt(0, 180)));
            
            this.animation = new Animation.Item(
                this.x + (animationX || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05))),
                this.y + 1.025, 
                this.z + (animationZ || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)))
            );

            this.animation.describeItem({
                id: itemID,
                count: 1,
                data: 0,
                size: 0.6,
                rotation: [Math.PI / 2, rotation || MathHelper.radian(MathHelper.randomInt(0, 180)), 0]
            });
            this.animation.load();
        } else {
            if(this.animation) {
                this.animation.destroy();
            }
        }
    }
}
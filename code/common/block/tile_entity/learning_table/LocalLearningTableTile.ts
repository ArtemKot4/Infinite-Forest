class LocalLearningTableTile extends LocalTileEntity {
    public onLoad(): void {
        this.create_animation();
    }

    public onUnload(): void {
        if(this.animation) {
            this.animation.destroy();
        }
    }

    @NetworkEvent
    public create_animation(): void {
        if(this.networkData.getBoolean("valid") == true && !this.animation) {
            const animationX = this.networkData.getFloat("animationX", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
            const animationZ = this.networkData.getFloat("animationZ", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
            const rotation = this.networkData.getFloat("rotation", MathHelper.radian(MathHelper.randomInt(0, 180)));
            
            this.animation = new Animation.Item(
                this.x + (animationX || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05))),
                this.y + 1.025, 
                this.z + (animationZ || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)))
            );

            this.animation.describeItem({
                id: ItemList.ANCIENT_NOTE.id,
                count: 1,
                data: 0,
                size: 0.6,
                rotation: [Math.PI / 2, rotation || MathHelper.radian(MathHelper.randomInt(0, 180)), 0]
            });

            this.animation.load();
        } else if(this.animation) {
            this.animation.destroy();
            delete this.animation;
        }
    }
}
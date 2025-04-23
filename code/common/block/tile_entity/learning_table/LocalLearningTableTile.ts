class LocalLearningTableTile extends LocalTileEntity {
    public createAnimation(coords: Vector, x?: number, z?: number, rotation?: number): Animation.Item {
        const animation = new Animation.Item(
            coords.x + (x || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05))),
            coords.y + 1.025, 
            coords.z + (z || MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)))
        );

        animation.describeItem({
            id: ItemList.ANCIENT_NOTE.id,
            count: 1,
            data: 0,
            size: 0.6,
            rotation: [Math.PI / 2, rotation || MathHelper.radian(MathHelper.randomInt(0, 180)), 0]
        });

        return animation;
    };

    public onLoad(): void {
        const is_valid = this.networkData.getBoolean("valid");

        const animationX = this.networkData.getFloat("animationX", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
        const animationZ = this.networkData.getFloat("animationZ", MathHelper.randomFromArray(MathHelper.range(0.3, 0.6, 0.05)));
        const rotation = this.networkData.getFloat("rotation", MathHelper.radian(MathHelper.randomInt(0, 180)));

        if(is_valid && !this.animation) {
            this.animation = this.createAnimation(this, animationX, animationZ, rotation);
            this.animation.load();
        };
    };

    public onUnload(): void {
        if(this.animation) {
            this.animation.destroy();
        };
    };

    @NetworkEvent
    public create_animation(data: { valid: boolean, animationX?: number, animationZ?: number, rotation?: number }): void {
        if(data.valid && !this.animation) {
            this.animation = this.createAnimation(this, data.animationX, data.animationZ, data.rotation);
            this.animation.load();
        } else if(this.animation) {
            this.animation.destroy();
            delete this.animation;
        };
    };
};
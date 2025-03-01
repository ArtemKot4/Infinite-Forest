class LocalLearningTableTile extends LocalTileEntity {
    public createAnimation(coords: Vector, x?: number, z?: number, rotation?: number): Animation.Item {
        const animation = new Animation.Item(
            coords.x + (x || MathHelper.randomFromArray(Utils.range(0.3, 0.6, 0.05))),
            coords.y + 1.025, 
            coords.z + (z || MathHelper.randomFromArray(Utils.range(0.3, 0.6, 0.05)))
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
        const is_valid = this.networkData.getBoolean("is_valid");

        const animation_x = this.networkData.getFloat("animation_x", MathHelper.randomFromArray(Utils.range(0.3, 0.6, 0.05)));
        const animation_z = this.networkData.getFloat("animation_z", MathHelper.randomFromArray(Utils.range(0.3, 0.6, 0.05)));
        const rotation = this.networkData.getFloat("rotation", MathHelper.radian(MathHelper.randomInt(0, 180)));

        if(is_valid && !this.animation) {
            this.animation = this.createAnimation(this, animation_x, animation_z, rotation);
            this.animation.load();
        };
    };

    public onUnload(): void {
        if(this.animation) {
            this.animation.destroy();
        };
    };

    @NetworkEvent
    public create_animation(data: { is_valid: boolean, animation_x?: number, animation_z?: number, rotation?: number }): void {
        if(data.is_valid && !this.animation) {
            this.animation = this.createAnimation(this, data.animation_x, data.animation_z, data.rotation);
            this.animation.load();
        } else if(this.animation) {
            this.animation.destroy();
            delete this.animation;
        };
    };
};
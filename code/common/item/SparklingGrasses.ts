class SparklingGrasses extends BasicItem implements INameOverrideCallback {
    public constructor() {
        super("sparkling_grasses", {
            name: "sparkling_grasses",
            meta: 0
        });
    }

    public onNameOverride(item: ItemInstance, translation: string, name: string): string | void {
        if(World.getThreadTime() % 20 == 0) {
            return MathHelper.randomFrom(Native.Color.GOLD, Native.Color.GREEN, Native.Color.RED, Native.Color.WHITE) + Translation.translate(name)
        }
    }

    public override getName(): string {
        return "item.infinite_forest.sparkling_grasses"
    }
}
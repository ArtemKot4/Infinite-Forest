class FearHud extends ForestEffectHud {
    public constructor() {
        super("fear", "unknown", "effect.fear_scale");
    }

    public override setScale(scale: string, value: number, max: number): void {
        this.UI.getElements().get("scale").setBinding("value", (value - MathHelper.randomInt(1, 6)) / max);
        return;
    }
}

class FearEffect extends Effect {
    public static HEIGHT: number = 40;

    public override progressMax: number = 250;

    public override getType(): string {
        return "fear";
    }

    protected getRange(): number {
        return 50;
    }

    public override getHud(): EffectHud {
        return new FearHud();
    }

    protected getLightLevel(): number {
        return 4;
    }

    protected getRandomHotbarSlot(): number {
        return MathHelper.randomInt(0, 8);
    }

    public override onFull(playerUid: number, data: IEffectData): void {
        const threadTime = World.getThreadTime();
        if(threadTime % 30 === 0) {
            const pos = Entity.getPosition(playerUid);
            const blockSource = BlockSource.getDefaultForActor(playerUid);

            if(blockSource.getDimension() === EDimension.INFINITE_FOREST.id) {
                this.breakLightning(pos, blockSource);
            }
        }
        if(threadTime % 8 === 0) {
            const user = new PlayerUser(playerUid);
            if(!user.getSelectedItem().isEmpty()) {
                const slotIndex = this.getRandomHotbarSlot();
                user.setSelectedSlot(slotIndex);
                const slot = user.getInventorySlot(slotIndex);
                Entity.setCarriedItem(playerUid, slot.id, slot.count, slot.data, slot.extra);
            }
        }
    }

    public breakLightning(pos: Vector, blockSource: BlockSource): void {
        const range = this.getRange();
        for(let y = -range/2; y <= range/2; y++) {
            for(let x = -range/2; x <= range/2; x++) {
                for(let z = -range/2; z <= range/2; z++) {
                    const id = blockSource.getBlockID(pos.x + x, pos.y + y, pos.z + z);
                    if(Block.getLightLevel(id) > 0) {
                        blockSource.destroyBlock(pos.x + x, pos.y + y, pos.z + z, true);
                    }
                }
            }
        }
    }
}

Effect.register(new FearEffect());
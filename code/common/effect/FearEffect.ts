class FearEffect extends Effect {
    public static HEIGHT = 40;

    public override progressMax: number = 80;

    public override onTick(playerUid: number): void {
        if(World.getThreadTime() % 30 === 0) {
            const pos = Entity.getPosition(playerUid);
            const blockSource = BlockSource.getDefaultForActor(playerUid);

            if(blockSource.getLightLevel(pos.x, pos.y, pos.z) <= this.getLightLevel()) {
                this.breakBottles(pos, blockSource);
            }
        }
    }

    public getLightLevel(): number {
        return 4;
    };

    protected override onEnd(playerUid: number, progressMax: number): void {
        Entity.clearEffect(playerUid, 4);
    }

    protected override getType(): string {
        return "fear";
    }

    protected getRange(): number {
        return 50;
    }

    public breakBottles(pos: Vector, blockSource: BlockSource): void {
        const range = this.getRange();
        for(let y = -range/2; y <= range/2; y++) {
            for(let x = -range/2; x <= range/2; x++) {
                for(let z = -range/2; z <= range/2; z++) {
                    const id = blockSource.getBlockID(pos.x + x, pos.y + y, pos.z + z);
                    if(id === BlockList.BOTTLE.id || id === BlockList.FIREFLIES_BOTTLE.id) {
                        blockSource.destroyBlock(pos.x + x, pos.y + y, pos.z + z, true);
                    }
                }
            }
        }
    }

    public override getHud(): EffectHud {
        return new EffectHud(this.getType(), "unknown", "effect.fear_scale");
    }

    @SubscribeEvent
    public onDestroyBlockContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number) {
        Network.sendToServer("packet.infinite_forest.cancel_destroy_block_fear", {});
    }
}

Network.addServerPacket("packet.infinite_forest.cancel_destroy_block_fear", (client, data) => {
    if(client == null) return;
    const playerUid = client.getPlayerUid();
    if(Curse.has("cursed_lightning") && Entity.getPosition(playerUid).y <= FearEffect.HEIGHT) {
        const effect = Effect.getFor(playerUid, "fear");
        if(effect.progress >= effect.progressMax) {
            return Game.prevent();
        }
    }
})

Effect.register(new FearEffect());
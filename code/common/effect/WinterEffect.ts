class WinterEffect extends Effect {
    public override progressMax: number = 80;

    public override getType(): string {
        return "winter";
    }

    public override getHud(): EffectHud {
        return new ForestEffectHud(this.getType(), "effect.winter_icon", "effect.winter_scale");
    }

    public override onFull(player: number): void {
        Entity.damageEntity(player, 1);
    }
}

Effect.register(new WinterEffect());
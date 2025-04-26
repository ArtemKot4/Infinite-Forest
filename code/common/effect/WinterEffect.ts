class WinterEffect extends Effect {
    public override progressMax: number = 80;

    protected override onTick(player: number): void {
        Entity.damageEntity(player, 1);
    }

    protected override getType(): string {
        return "winter";
    }

    public override getHud(): EffectHud {
        return new EffectHud(this.getType(), "effect.winter_icon", "effect.winter_scale");
    }
}

Effect.register(new WinterEffect());
class WinterEffect extends Effect {
    public override progress_max: number = 80;

    public override onTick(player: number): void {
        Entity.damageEntity(player, 1);
    };

    public override getHud(): EffectHud {
        return new EffectHud("effect.winter_icon", "effect.winter_scale");
    };
};
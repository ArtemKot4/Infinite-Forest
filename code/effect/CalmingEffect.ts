class CalmingEffect extends Effect {
    public override progress_max: number = 80;
    public onInit(player: number, progress_max: number): void {
        const client = Network.getClientForPlayer(player);

        if(client) {
            client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.calming_effect"))
        };
    };

    public override onTick(player: number): void {
        if(World.getThreadTime() % 20 === 0) {
            Entity.addEffect(player, EPotionEffect.REGENERATION, 3, 20, true, true);
        };
    };

    public override getHud(): EffectHud {
        return new EffectHud("effect.calming_icon", "effect.calming_scale");
    };
};

Translation.addTranslation("message.infinite_forest.calming_effect", {
    en: "You feel calm and peaceful. You feel that everything is still ahead of you. Relax.",
    ru: "Вы чувствуете неожиданный прилив спокойствия. Вам кажется, что все проблемы остались позади. Отдыхайте."
})
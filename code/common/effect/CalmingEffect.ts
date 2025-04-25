class CalmingEffect extends Effect {
    public override progressMax: number = 80;
    public onInit(player: number, progressMax: number): void {
        const client = Network.getClientForPlayer(player);

        if(client) {
            const text = Translation.translate("message.infinite_forest.calming_effect");
            Notification.get("transparent").init("transparent", {
                text: {
                    type: "text",
                    x: 0,
                    font: {
                        color: android.graphics.Color.GREEN,
                        size: 25
                    },
                    text: text,
                    maxLineLength: text.length
                },
                frame: {
                    type: "custom",
                    x: 0,
                    y: 0,
                    width: 220 * 2.3,
                    height: 30 * 2.3,
                    custom: {
                        onSetup(element) {
                            this.paint = new android.graphics.Paint();
                            this.paint.setARGB(100, 0, 0, 0);
                            element.setSize(180 * 2.3 + (((text.length  || 1) / 10) * 10), 20 * 2.3);
                        },
                        onDraw(element, canvas, scale) {
                            canvas.drawRect(0, 0, canvas.getWidth(), canvas.getHeight(), this.paint);
                        }
                    }
                },
            }); 
            client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.calming_effect"));
        }
    }

    public override onTick(player: number): void {
        Entity.addEffect(player, EPotionEffect.REGENERATION, 3, 5, true, true);
    }

    public override getHud(): EffectHud {
        return new EffectHud("effect.calming_icon", "effect.calming_scale");
    }
}

Translation.addTranslation("message.infinite_forest.calming_effect", {
    en: "You feel calm and peaceful. You feel that everything is still ahead of you.",
    ru: "Вы чувствуете неожиданный прилив спокойствия. Вам кажется, что все проблемы остались позади."
});
interface IRiftCommandParams extends ICommandParams {
    action: string;
    scale?: number;
    y: number;
    z: number;
}

class RiftCommand extends ServerCommand<IRiftCommandParams> {
    public constructor() {
        super("if:skyrift", {
            action: "string",
            scale: "number",
            x: "number",
            y: "number"
        }, 1);
    }

    public override onServer(client: NetworkClient, data: IRiftCommandParams): void {
        if(client == null) return;
        const playerUid = client.getPlayerUid();
        
        if(!new PlayerActor(playerUid).isOperator()) {
            return client.sendMessage(Native.Color.RED + Translation.translate("message.fireflies.not_allowed"));
        };

        switch(data.action) {
            case "spawn": {
                const pos = Entity.getPosition(playerUid);
                const scale = data.scale || 0.1;
                const rift = new SkyRift.UpdatableEntity(pos.x, pos.y + 0.5, pos.z, Entity.getDimension(playerUid));
                rift.scale = scale;
                if(!data.scale) {
                    rift.scaleMax = Math.ceil(scale) * 2;
                };
                SkyRift.create(rift);
                return client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.rift_created"));
            }
            case "destroy": {
                if(!data.scale || !data.y || !data.z) {
                    return client.sendMessage(Native.Color.RED + Translation.translate("message.infinite_forest.rift_coords_not_enough"));
                }
                const predicate = (v: SkyRift.UpdatableEntity) => Math.ceil(v.x) == Math.ceil(data.scale) && Math.ceil(v.y) == Math.ceil(data.y) && Math.ceil(v.z) == Math.ceil(data.z);
                const object = SkyRift.entities.find(predicate);
                if(object) {
                    object.destroy();
                    SkyRift.entities.splice(SkyRift.entities.indexOf(object), 1);
                    return client.sendMessage(Native.Color.GREEN + Translation.translate("message.infinite_forest.rift_destroyed"));
                }
            }
        }
    }
}

Command.register(new RiftCommand());

Translation.addTranslation("message.infinite_forest.rift_coords_not_enough", {
    ru: "Недостаточно координат!",
    en: "Not enough coordinates!"
});

Translation.addTranslation("message.infinite_forest.rift_created", {
    ru: "Разлом создан!",
    en: "Rift created!"
});

Translation.addTranslation("message.infinite_forest.rift_destroyed", {
    ru: "Разлом удален!",
    en: "Rift destroyed!"
});
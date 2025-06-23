class ForestMap extends BasicItem implements IItemUseCallback, IItemHoldCallback, INameOverrideCallback {
    public map: MapBase = new BiomeBoundMap(this.id);

    public constructor() {
        super("forest_map", {
            name: "forest_map",
            meta: 0
        }, {
            stack: 1
        });
        ItemModel.getForWithFallback(this.id, 0).setHandModel(new RenderMesh());
        Network.addClientPacket("packet.infinite_forest.open_" + this.stringID + "_map", (data: { distance: number, positionKey: string, positionData: number[] }) => {
            return this.map.open(data.distance, data.positionKey, data.positionData, Player.getLocal());
        });
    }

    public onNameOverride(item: ItemInstance, translation: string, name: string): string | void {
        return (
            Translation.translate(name) + "\n" + Native.Color.GRAY + 
            Translation.translate("message.infinite_forest.map_distance") + " " + 
            ((item.extra && item.extra.getInt("distance")) || "?")
        );
    }

    public hasNotData(item: ItemInstance): boolean {
        return !item.extra || item.extra && !item.extra.getString("position");
    }

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, playerUid: number): void {
        if(this.hasNotData(item)) {
            this.recordData(playerUid, item);
        }
    }

    public onItemHold(item: ItemInstance, playerUid: number, slotIndex: number): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            if(this.hasNotData(item)) {
                if(World.getThreadTime() % 80 == 0) {
                    client.sendMessage(Translation.translate("message.infinite_forest.record_map_warning"));
                }
                return;
            }
            client.send("packet.infinite_forest.open_" + this.stringID + "_map", {
                distance: item.extra.getInt("distance", this.map.DEFAULT_DISTANCE),
                positionKey: item.extra.getString("position"),
                positionData: item.extra.getString("position").split(":").map(v => Number(v))
            });
        }        
    }

    public recordData(playerUid: number, item: ItemInstance): void {
        const position = Entity.getPosition(playerUid);
        const extra = new ItemExtraData();

        extra.putString("position", position.x + ":" + position.z); 
        extra.putInt("distance", item.extra ? item.extra.getInt("distance", this.map.DEFAULT_DISTANCE) : this.map.DEFAULT_DISTANCE);
        Entity.setCarriedItem(playerUid, this.id, 1, 0, extra);
    }

    public getName(): string {
        return "item.infinite_forest.forest_map";
    }
}

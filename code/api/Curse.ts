class Curse {
    public static list: string[] = [
        "cold",
        "fire",
        "cursed_lightning",
        "dungeon"
    ];

    public static sendClient(client: NetworkClient) {
        if(client) {
            client.send("packet.infinite_forest.curse_client_list", { list: Curse.list });
        };
    };

    public static break<T extends (...args: unknown[]) => void>(curse: string, event?: T, event_args?: Parameters<T>) {
        Curse.list.splice(Curse.list.indexOf(curse), 1);
        Network.sendToAllClients("packet.infinite_forest.curse_client_list", { list: Curse.list });

        if(event) {
            event(...event_args);
        };
        return;
    };

    public static has(curse: string) {
        return Curse.list.includes(curse);
    };
};

Callback.addCallback("ServerPlayerLoaded", (player) => {
    Curse.sendClient(Network.getClientForPlayer(player));
});

Network.addClientPacket("packet.infinite_forest.curse_client_list", (data: { list: string[] }) => {
    Curse.list = data.list;
});
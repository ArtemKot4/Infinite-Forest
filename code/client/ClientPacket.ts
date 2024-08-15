abstract class ClientPacket {
    protected constructor() {
    };
    static identifier: string
    static function: (data: [] | {}) => any; 
}

Callback.addCallback("ItemUseNoTarget", (item, player) => {
    LazerParticlePacket.send(player);
})
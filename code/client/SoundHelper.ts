class SoundHelper {
    /**
     * Method to initialize all sounds from directory
     * @param dir path to sounds
     */
    public static initFrom(dir: string) {
        SoundManager.init(16);
        SoundManager.setResourcePath(dir);

        for(const file of FileTools.GetListOfFiles(dir)) {
            const name = file.getName();
            SoundManager.registerSound(`infinite_forest.${name}`, name);
        }
    };

    /** 
     * Server method to play sound to client with player uid
     * @param player_uid id of player
     * @param name name of sound
     * @param volume volume of sound
     * @param pitch pitch of sound
     */
    public static playFor(player_uid: number, name: string, volume?: number, pitch?: number) {
        const client = Network.getClientForPlayer(player_uid);
        if(client) {
            client.send("packet.infinite_forest.play_sound", {
                name,
                volume,
                pitch
            } satisfies IClientSoundSender);
        }
    }
}

interface IClientSoundSender {
    name: string;
    volume?: number,
    pitch?: number
}

Network.addClientPacket("packet.infinite_forest.play_sound", (data: IClientSoundSender) => {
    return SoundManager.playSound(`infinite_forest.${data.name}`, data.volume, data.pitch);
});

SoundHelper.initFrom(__dir__ + "resources/assets/sounds/");

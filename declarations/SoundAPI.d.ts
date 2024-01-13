declare const CONFIG: {
    maxStreams: number;
    forceOneChannel: boolean;
};
declare function Sound (name: string | number): void
declare namespace SoundAPINetwork {
    enum NetworkPacket {
        Play = "soundapi.play",
        Pause = "soundapi.pause",
        Stop = "soundapi.stop"
    }
    interface SoundData {
        id: number;
    }
    interface PlayData extends SoundData {
        uid: string;
        target: Target;
        distance: number;
        volume: number;
        loop: boolean;
    }
}
declare const File: typeof java.io.File;
interface ObjectConstructor {
    values<A>(a: A): A[keyof A][];
}
declare class InvalidOptions extends Error {
    readonly uid: string;
    constructor(uid: string, message: string);
}
declare class SourceError extends Error {
    readonly uid: string;
    constructor(uid: string);
}
interface Position extends Vector {
    dimension: number;
}
declare type Target = number | Position;
declare const MUTABLE_VOLUME = 0.8;
interface Volume {
    left: number;
    right: number;
}
declare abstract class SoundAPIPlayer {
    protected readonly uid: string;
    protected readonly options: Meta;
    private static players;
    static tick(): void;
    private static networkId;
    protected networkId: number;
    protected source: Target;
    protected _distance: number;
    protected _volume: number;
    protected _sync: boolean;
    protected _loop: boolean;
    get looped(): boolean;
    private prepared;
    private paused;
    constructor(uid: string, options: Meta);
    /**
     * Enable sync player in multiplayer
     * @returns {this} this player
     */
    sync(): this;
    /**
     * Disable sync player in multiplayer
     * @returns {this} this player
     */
    sync(sync: false): this;
    /**
     * Enable/disable sync player in multiplayer
     * @returns {this} this player
     */
    sync(sync: boolean): this;
    /**
     * Set source at entity
     * @param {number} entity - UID entity
     * @returns {this} this player
     */
    at(entity: number): this;
    /**
     * Set source at coordinates in dimension
     * @param {Position} position - Coordinates with dimension
     * @returns {this} this player
     */
    at(position: Position): this;
    /**
     * Set source at entity or coordinates indimension
     * @param {Target} target - UID entity or Coordinates with dimension
     * @returns {this} this player
     */
    at(target: Target): this;
    /**
     * Set sound distance
     * @param {number} dist - sound distance
     * @returns {this} this player
     */
    distance(dist: number): this;
    /**
     * Set volume for player
     * @param {number} volume - volume >= 0 and <= 1
     * @returns {this} this player
     */
    volume(volume: number): this;
    /**
     * Set looping
     * @param {boolean} looping - if true, enables playback looping, otherwise disables.
     * @returns {this} this player
     */
    loop(looping?: boolean): this;
    protected _prepare(): void;
    /**
     * Prepare player.
     */
    prepare(): this;
    protected abstract _play(): void;
    protected abstract _resume(): void;
    protected abstract _pause(): void;
    protected abstract _stop(): void;
    /**
     * Start playing sound.
     */
    play(): void;
    /**
     * Pause playing sound.
     */
    pause(): void;
    /**
     * Resume playing sound.
     */
    private resume;
    /**
     * Stop playing sound.
     */
    stop(): void;
    protected stopWithoutSync(): void;
    protected simpleCalc(sourcePosition: Vector, listenerPosition: Vector, multiplyVolume: number): Volume;
    protected advancedCalc(sourcePosition: Vector, listenerPosition: Vector, lookVector: Vector, multiplyVolume: number): Volume;
    protected calcVolume(): Volume;
    protected abstract _tick(volume: Volume): void;
    private tick;
    protected send<D>(packet: SoundAPINetwork.NetworkPacket, data: D): void;
    static stopAll(): void;
}
declare class MediaPlayer extends SoundAPIPlayer {
    protected options: MediaMeta;
    protected media: android.media.MediaPlayer;
    protected _prepare(): void;
    protected _play(): void;
    protected _resume(): void;
    protected _pause(): void;
    protected _stop(): void;
    protected _tick(volume: Volume): void;
}
declare class SoundPlayer extends SoundAPIPlayer {
    private static SoundPool;
    private static initFunctions;
    private static getMaxStreams;
    static init(): void;
    static load(file: string): number;
    protected streamId: number;
    protected get SoundPool(): android.media.SoundPool;
    protected options: PoolMeta;
    protected _play(): void;
    protected _resume(): void;
    protected _pause(): void;
    protected _stop(): void;
    protected _tick(volume: Volume): void;
}
declare type Range = {
    min: number;
    max: number;
};
interface Dict<value> {
    [key: string]: value;
}
interface SoundAdditiveOptions {
    /**
     * Sound hearing distance.
     * @default 16
     */
    defaultDistance: number;
    /**
    * Default sound volume
    * @default 1
    */
    defaultVolume: number;
    /**
     * Clamp sound volume,
     * @default (0,1)
     */
    clampVolume: Range;
    /**
     * Set default mode looping
     * @default false
     */
    loop: boolean;
    /**
     * Type sound. Used for setting volume from game settings.
     * @default "sound"
     */
    type: SoundAPI.Type;
    /**
     * Sync player in multiplayer
     * @default true
     */
    sync: boolean;
    /**
     * @default false
     */
    muteInSolidBlock: boolean;
}
interface SoundOptions extends Partial<SoundAdditiveOptions> {
    /**
     * Path to file
     */
    source: string;
}
interface SoundMeta extends SoundOptions {
    typePlayer: "pool" | "player";
}
interface MediaMeta extends SoundMeta {
    typePlayer: "player";
}
interface PoolMeta extends SoundMeta {
    typePlayer: "pool";
    soundId: number;
}
declare function isPoolMeta(meta: Meta): meta is PoolMeta;
declare type Meta = PoolMeta | MediaMeta;
declare class SoundAPI {
    protected readonly mod_id: string;
    constructor(mod_id: string);
    private static readonly sounds;
    private static getSoundOptions;
    private getUid;
    /**
     * Register sound in system with default settings
     * @param {string} uid - Unical ID for sound
     * @param {string} source - path to sound
     */
    registerSound(uid: string, source: string): void;
    /**
     * Register sound in system
     * @param {string} uid - Unical ID for sound
     * @param {SoundOptions} options - Options sound
     */
    registerSound(uid: string, options: SoundOptions): void;
    static select(uid: string): SoundAPIPlayer;
    select(uid: string): SoundAPIPlayer;
}
declare namespace SoundAPI {
    enum Type {
        SOUND = "sound",
        MUSIC = "music",
        AMBIENT = "ambient",
        BLOCK = "block",
        HOSTILE = "hostile",
        NEUTRAL = "neutral",
        RECORD = "record",
        PLAYER = "player",
        WEATHER = "weather"
    }
}
declare const defaultOptions: Readonly<SoundAdditiveOptions>;
declare function buildAudioAttributes(): android.media.AudioAttributes | false;
declare namespace Vector {
    function getDistance(A: Vector, B: Vector): number;
}

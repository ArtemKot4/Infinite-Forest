/**
 * Библиотека открыта для всех желающих создать уникальные эффекты с использованием интерфейсов. Поддерживает анимацию и готова помочь реализовать любые ваши идеи!
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
interface IEffectData {
    timer: number;
    timerMax?: number;
    progress: number;
    progressMax: number;
    lock?: boolean;
}
/**
 * Class of effect hud.
 */
declare abstract class EffectHud {
    type: string;
    /**
     * Set of positions opened huds. Need to work animation of replace positions.
     */
    static positions: Set<number>;
    /**
     * Common height of hud.
     */
    height: number;
    /**
     * Thread of hud. Use to improved operations.
     */
    thread: java.lang.Thread;
    /**
     * Current index of hud in {@link positions}.
     */
    index: number;
    /**
     * Lock state.
     */
    lock: boolean;
    /**
     * UI of hud. Opening without {@link open} opens empty white ui.
     */
    UI: UI.Window;
    /**
     * @param type effect type
     */
    constructor(type: string);
    /**
     * Method, defines sleep time to thread.
     */
    getThreadSleepTime(): number;
    /**
     * Method, defines spacing between hud. Usings by formula: ({@link getLocation getLocation().y } + {@link getSpacing getSpacing()} * index).
     */
    getSpacing(): number;
    /**
     * Method, defines hud's location. "y" value uses to set positions to elements, but don't includes in result window content location "y" field. Method must be defined.
     */
    abstract getLocation(): UI.WindowLocationParams;
    /**
     * Method, defines hud's elements. Must be defined.
     */
    abstract getElements(): UI.ElementSet;
    /**
     * Method, defines hud's background color.
     * @default android.graphics.Color.TRANSPARENT
     */
    getBackgroundColor(): number;
    /**
     * Method, builds and returns hud's window content by defined methods.
     */
    getContent(): UI.WindowContent;
    /**
     * Method to get opened state of window.
     */
    isOpened(): boolean;
    /**
     * Method, opens ui with builded content and increases {@link positions} size.
     */
    open(): void;
    /**
     * Method, closes ui and decreases {@link positions} size by delete {@link index} value.
     */
    close(): void;
    /**
     * Method set scale of hud.
     * @param scale scale name
     * @param value value
     * @param max max value
     */
    setScale(scale: string, value: number, max: number): void;
    /**
     * Method sets hud alpha to 0 and clears scale filling.
     */
    clear(): void;
    /**
     * Method, defines condition to prevent init hud.
     * @param playerUid number
     * @returns condition
     */
    preventInit(playerUid: number): boolean;
    /**
     * Method, calls when initialization was prevented.
     * @param playerUid player unique identifier
     */
    onPreventInit(playerUid: number): void;
    /**
     * Method, calls when hud was initialized.
     * @param playerUid player unique identifier
     */
    onInit?(playerUid: number): void;
    /**
     * Method, works when thread works.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onThread?(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when hud was appeared.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onAppear?(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when hud was disappeared.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onDisappear?(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when hud was closed.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onClose(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when hud full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onFull(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, inits hud.
     * @param playerUid player unique identifier
     */
    init(playerUid: number): void;
    /**
     * Method, sets height of hud elements.
     * @param height height
     */
    setHeight(height: number): void;
    /**
     * Method, checks is valid height for hud with specified index.
     * @param index number
     * @returns condition
     */
    isValidHeightFor(index: number): boolean;
    /**
     * Method, realizes animation of replace positions.
     * @param playerUid player unique identifier
     */
    animate(playerUid: number): void;
    /**
     * Method, works in thread of hud.
     * @param playerUid player unique identifier
     */
    run(playerUid: number): void;
    /**
     * Method, increases {@link positions} size.
     */
    static increaseCount(): void;
    /**
     * Method, decreases {@link positions} size with delete value by specified index.
     * @param index number
     */
    static decreaseCountBy(index: number): void;
}
interface IEffect {
    readonly timerMax?: number;
    readonly progressMax: number;
    getType(): string;
    getHud(): EffectHud;
    onFull?(playerUid: number, data: IEffectData): void;
    onIncrease?(playerUid: number, data: IEffectData): void;
    onDecrease?(playerUid: number, data: IEffectData): void;
    onInit?(playerUid: number, data: IEffectData): void;
    onEnd?(playerUid: number, data: IEffectData): void;
    init?(playerUid: number, progressMax?: number, timerMax?: number): void;
}
/**
 * Class to create your custom effects.
 */
declare class Effect implements IEffect {
    /**
     * Method to get empty data for effects. Use if {@link clearFor} method don't satisfies your needs
     */
    static getEmptyData: () => IEffectData;
    /**
     * Object of all players with all their effects
     */
    static players: Record<number, Record<string, IEffectData>>;
    /**
     * List of all effects
     */
    static list: Record<string, Effect>;
    /**
     * Progress max value of your effect in default.
     */
    readonly progressMax: number;
    /**
     * Timer max value of your effect in default.
     */
    readonly timerMax?: number;
    /**
     * Your hud from {@link getHud} in field after create instance
     */
    hud: EffectHud;
    /**
     * @param prototype Prototype of your effect. Use if you don't use your extended {@link Effect} class.
     */
    constructor(prototype?: IEffect);
    /**
     * Method to get your effect type. Must be defined.
     */
    getType(): string;
    /**
     * Method to set field {@link hud} value. Must be defined.
     */
    getHud(): EffectHud;
    /**
     * Method, calls when your scale effect is full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onFull(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when your scale effect is increasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onIncrease(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when your scale effect is decreasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onDecrease(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when you call init method.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onInit?(playerUid: number, effectData: IEffectData): void;
    /**
     * Method, calls when effect go away.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    onEnd?(playerUid: number, effectData: IEffectData): void;
    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     */
    protected initFor(playerUid: number): void;
    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     * @param progressMax progress max
     * @param timerMax timer max
     */
    init(playerUid: number, progressMax?: number, timerMax?: number): void;
    /**
     * Method to register your effect in {@link list}
     * @param effect your effect or prototype
     */
    static register(effect: IEffect | Effect): Effect;
    /**
     * Method to get your effect by type;
     */
    static get<T extends Effect>(effectType: string): Nullable<T>;
    /**
     * Method to get effect data for specified player
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */
    static getFor(playerUid: number, effectType: string): Nullable<IEffectData>;
    /**
     * Method to update effect data about player on client side;
     * @param effectType type of effect;
     * @param effectData effect data of player. All is optional, e.g. it is assigning new data with previous data
     */
    static sendFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void;
    /**
     * Method to set effect data for specified player, if player exists in data.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     * @param effectData effect data of player
     */
    static setFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void;
    /**
     * Method to clear effect data for specified player by server and client side.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */
    static clearFor(playerUid: number, effectType: string): void;
}
declare namespace Callback {
    /**
     * Callback, calls when effect inits.
     * @param playerUid player unique identifier
     * @param progressMax max progress
     * @param timerMax max timer
     */
    interface EffectInit {
        (playerUid: number, progressMax?: number, timerMax?: number): void;
    }
    function addCallback(name: "EffectInit", func: EffectInit, priority?: number): void;
}

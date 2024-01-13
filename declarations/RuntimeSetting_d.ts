/// <reference path="./android.d.ts"

type ConfigValue = string | boolean | number;
type ConfigType = {[key: string]: ConfigValue};
type ChangeHandler = (cfg: ConfigType, config: ConfigStorage, self: BuilderConfig) => void;

declare class ConfigStorage {
    constructor(path: string);

    public set(name: string, v: ConfigValue): ConfigStorage;
    public put(name: string, v: ConfigValue): ConfigStorage;
    public can(name: string): ConfigStorage;
    public get(name: string, failed: ConfigValue): any;

    public save(): void;
    public read(): void;

    public build(): ConfigType;
}

declare class BuilderConfig {
    constructor(config: ConfigStorage);

    public addSectionDivider(text: string): BuilderConfig;
    public addText(text: string, value: string): BuilderConfig;

    public addCheckBox(text: string, config_name: string): BuilderConfig;
    public addSlider(name: string, config_name: string, min: number, max: number, change: number): BuilderConfig;
    public addChangeChoice(name: string, config_name: string): BuilderConfig;

    public setChangeSetting(func: ChangeHandler): Setting;
    public setTitle(title: string): BuilderConfig;
    public setExit(text: string): BuilderConfig;

    public open(): BuilderConfig;
}

declare class Setting {
    constructor(path: string);
    public updateIconName(): Setting;
    public setIcon(icon: android.graphics.Bitmap): Setting;
    public setName(name: string): Setting;
    public setChangeSetting(func: ChangeHandler): Setting;
    public getWidth(): number;
    public setBuilderConfig(builder: BuilderConfig): Setting;

    public static list: Setting[];
}

interface IRuntimeConfig {
    ConfigStorage: typeof ConfigStorage,
    BuilderConfig: typeof BuilderConfig,
    Setting: typeof Setting
}

declare namespace ModAPI {
    export function addAPICallback(name: "RuntimeConfig", func: (api: IRuntimeConfig) => void): void;
}
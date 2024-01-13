interface IConfig {
    x: number;
    y: number;
    scale: number;
    theme: string;
}

interface ITheme {
    slot?: string;
    invSlot?: string;
    selected_slot?: string;
    selected_invSlot?: string;
    frame?: string;
    icon_scale?: number;
    color_inventory?: string;
    color_title?: string;
}

interface ITab {
    id: number;
    icon?: ItemInstance;
    onClick?(def: UI.WindowGroup, config: IConfig, theme: ITheme, id: string): UI.IWindow;
}

interface UiConfig {
    disableJeiMobile?: boolean;
    disableInventory?: boolean;
    tabs?: {
        left?: ITab[];
        rigth?: ITab[];
    }
}

interface IHandler {
    preCreate?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    postCreate?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;

    updateUi?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;

    onClose?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    onOpen?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    replaceTheme?(group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
}

interface IHandlerAll {
    preCreate?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    postCreate?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;

    updateUi?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;

    onClose?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    onOpen?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
    replaceTheme?(id: string, group: UI.WindowGroup, tile: TileEntity.TileEntityPrototype): void;
}


interface ClassicUI {
    getWindow(id: string, result: UI.IWindow, tile?: TileEntity.TileEntityPrototype): UI.IWindow;
    addVanillaSlots(id: string | number): void;

    getConfig(id: number | string): IConfig;
    getTheme(id: number | string): ITheme;
    registerUiConfig(id: number | string, config: IConfig): void;
    registerTheme(id: number | string, config: ITheme): void;

    setBlockFunctions(id: number, config: UiConfig): void;
    getBlockFunctions(id: number): UiConfig;
    buildMain(ui: UI.IWindow, id: string, config: IConfig): UI.IWindow;

    getSizeClassicUi(id: number, group: UI.WindowGroup): void;

    setConfigDefaultValue(id: number, name: string, value: any): void;
    addedConfig(id: number, ...args): void;

    registerHandler(id: number | string, handler: IHandler): void;
    registerAllHandler(handler: IHandlerAll): void;

    requireGlobal(cmd: string): any;
}

declare namespace ModAPI {
    function addAPICallback(apiName: "ClassicUI", api: ClassicUI);
}
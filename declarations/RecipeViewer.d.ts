/// <reference path="C:\Users\Пользователь\Desktop\Игры\HORIZON MODDING KERNEL\Inner Core Mod Toolchain\toolchain\toolchain\declarations\core-engine.d.ts" /> 
declare type ItemType = "block" | "item";
declare interface ItemInfo {
    id: number;
    data: number;
    name: string;
    type: ItemType;
}
declare interface LiquidInstance {
    liquid: string,
    amount: number;
}
declare interface ItemInstanceWithTips extends ItemInstance {
    tips?: {[key: string]: any};
}
declare interface LiquidInstanceWithTips extends LiquidInstance {
    tips?: {[key: string]: any};
}
declare interface RecipePattern {
    input?: ItemInstanceWithTips[],
    output?: ItemInstanceWithTips[],
    inputLiq?: LiquidInstanceWithTips[],
    outputLiq?: LiquidInstanceWithTips[],
    [key: string]: any;
}
declare interface OldRecipeContents {
    icon: Tile | number;
    description?: string;
    params?: UI.BindingsSet;
    drawing?: UI.DrawingSet;
    elements: {[key: string]: Partial<UI.UIElement>};
}
declare interface OldRecipeTypeProperty {
    title?: string;
    contents: OldRecipeContents;
    recipeList?: RecipePattern[];
    getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[];
    getAllList?: () => RecipePattern[];
    onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void;
}
declare interface RecipeTE {
    type: "grid" | "line" | "not_shape";
    recipe: string[] | string[][];
    ingredients: {[key: string]: ItemInstance};
    result: ItemInstance;
}
/** @deprecated */
declare interface RecipeViewerOld {
    registerRecipeType(key: string, obj: OldRecipeTypeProperty): void;
    getIOFromTEWorkbench(recipe: RecipeTE, cols: number): RecipePattern;
    registerTEWorkbenchRecipeType(sid: string, contents: OldRecipeContents, recipes: RecipeTE[]): void;
    removeDuplicate(item1: ItemInfo, index: number, array: ItemInfo[]): boolean;
    getName(id: number, data?: number): string;
    addList(id: number, data: number, type?: ItemType): void;
    addListByData(id: number, data: number, type?: ItemType): void;
    openRecipePage(key: string, container: UI.Container): void;
    putButtonOnNativeGui(screen: string, key: string): void;
}
declare interface RecipeContents {
    params?: UI.BindingsSet,
    drawing?: UI.DrawingSet,
    elements: {[key: string]: Partial<UI.Elements>};
}
declare abstract class RecipeType {
    private readonly name;
    private readonly windows;
    readonly window: UI.Window;
    readonly icon: ItemInstance;
    private description;
    private tankLimit;
    private readonly inputSlotSize;
    private readonly outputSlotSize;
    private readonly inputTankSize;
    private readonly outputTankSize;
    private windowWidth;
    private windowHeight;
    constructor(name: string, icon: Tile | number, content: {
        params?: UI.BindingsSet;
        drawing?: UI.DrawingElements;
        elements: {
            [key: string]: Partial<UI.UIElement>;
        };
    });
    setGridView(row: number, col: number, border?: boolean | number): RecipeType;
    setDescription(text: string): RecipeType;
    setTankLimit(limit: number): RecipeType;
    getName(): string;
    getIcon(): ItemInstance;
    getDescription(): string;
    getWindow(): UI.Window;
    getRecipeCountPerPage(): number;
    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    getListByLiquid(liquid: string, isUsage: boolean): RecipePattern[];
    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean;
    hasAnyRecipeByLiquid(liquid: string, isUsage: boolean): boolean;
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
    showRecipe(recipes: RecipePattern[]): void;
    slotTooltip(name: string, item: ItemInstance, tips: {
        [key: string]: any;
    }): string;
    tankTooltip(name: string, liquid: LiquidInstance, tips: {
        [key: string]: any;
    }): string;
}
declare class RecipeTypeRegistry {
    private static readonly types;
    static register(key: string, recipeType: RecipeType): void;
    static get(key: string): RecipeType;
    static isExist(key: string): boolean;
    static delete(key: string): void;
    static getAllKeys(): string[];
    static getLength(): number;
    static getActiveType(id: number, data: number, isUsage: boolean): string[];
    static getActiveTypeByLiquid(liquid: string, isUsage: boolean): string[];
    static openRecipePage(recipeKey: string | string[]): void;
    static openRecipePageByItem(id: number, data: number, isUsage: boolean): boolean;
    static openRecipePageByLiquid(liquid: string, isUsage: boolean): boolean;
    static getLiquidByTex(texture: string): string;
}
declare class ItemList {
    private static list;
    static get(): ItemInfo[];
    static getItemType(id: number): "block" | "item";
    static addToList(id: number, data: number, type?: "block" | "item"): void;
    static addToListByData(id: number, data: number | number[], type?: "block" | "item"): void;
    static addVanillaItems(): void;
    static addModItems(): void;
    static getName(id: number, data?: number): string;
    static setup(): void;
    static cacheIcons(): void;
}
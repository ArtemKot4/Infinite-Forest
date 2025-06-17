/// <reference path="./JavaDungeonUtility.d.ts"

declare const StructureLoaderJava: typeof JavaStructureLoader;
declare const StructurePoolJava: typeof JavaStructurePool;
declare const BlockData: typeof JavaBlockData;
declare const StructureDescriptionJava: typeof JavaStructureDescription;
declare const StructureCompression: typeof JavaStructureCompression;
declare const LoaderType: typeof JavaLoaderType;
declare const DUUtils: typeof JavaUtils; //original: Utils
declare const DEFAULT_POOL_NAME = "default";
type STRUCTURE = string | JavaStructureDescription;
declare class StructurePool {
    private readonly self;
    constructor(name: string | JavaStructurePool, global?: boolean);
    getName(): string;
    put(name: string, stru: JavaStructureDescription): StructurePool;
    setPathStructures(path: string): StructurePool;
    get(name: string): JavaStructureDescription;
    isLoad(name: string): boolean;
    deLoad(name: string): StructurePool;
    getAllStructure(): string[];
    load(path: string, name?: string, type?: FILE_FORMATS, compression?: boolean): StructurePool;
    upload(name: string, type: FILE_FORMATS): StructurePool;
    copy(name1: string, name2: string, prot: IStructureCopy): StructurePool;
    StructureAdvanced(name: string): Structure.advanced;
    registerRotations(stru: STRUCTURE, rotates: ROTATION[]): StructurePool;
    setGlobalPrototype(name: string, obj: IStructurePrototype): StructurePool;
    loadRuntime(name: string, path: string, type?: FILE_FORMATS, compression?: boolean): StructurePool;
}
declare namespace StructureLoader {
    function getStructurePoolByName(name: string): StructurePool;
    function getAllPool(): string[];
    function getAllStructureAndPool(): java.util.HashMap<string, string[]>;
    function registerType(name: string, obj: ILoaderType): void;
    function getStructure(name: STRUCTURE): JavaStructureDescription;
    function compile(path: string): void;
    function decompile(path: string): void;
    /**@deprecated */
    function save(path: string, name: string, type?: string, compression?: boolean): void;
    /**@deprecated */
    function load(path: string, name?: string, type?: FILE_FORMATS, compression?: boolean): void;
    /**@deprecated */
    function loadRuntime(path: string, name?: string, type?: FILE_FORMATS, compression?: boolean): void;
    /**@deprecated */
    function setStructure(name: string, stru: JavaStructureDescription): void;
    /**@deprecated */
    function isLoad(name: string): boolean;
    /**@deprecated */
    function deLoad(name: string): void;
}
declare const StructureJava: typeof JavaStructure;
declare const DefaultStructurePrototype: typeof JavaDefaultStructurePrototype;
declare const StructureDestructibilityJava: typeof JavaStructureDestructibility;
declare function getRegion(): BlockSource;
declare class StructureDestructibility {
    private readonly self;
    addBlock(id: number, state: BlockState): StructureDestructibility;
    get(): JavaStructureDestructibility;
}
interface ILegacyDefaultStructurePrototype {
    name?: string;
    blocks: JavaStructureDestructibility;
}
declare namespace Structure {
    function getPrototypeDefault(obj: string | ILegacyDefaultStructurePrototype, blocks?: StructureDestructibility): JavaDefaultStructurePrototype;
    function setStructure(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource, packet?: any): void;
    function set(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource, packet?: any): void;
    function build(name: STRUCTURE, x: number, y: number, z: number, sleep: number, region?: BlockSource, packet?: any): void;
    function isStructure(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): boolean;
    function is(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): boolean;
    function isSetStructure(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): boolean;
    function isSet(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): boolean;
    function canSet(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): boolean;
    function destroy(name: STRUCTURE, x: number, y: number, z: number, region?: BlockSource): void;
    class advanced {
        readonly stru: JavaStructure;
        constructor(name: STRUCTURE);
        getStructureJava(): JavaStructure;
        setUseGlobalPrototype(value: boolean): advanced;
        isUseGlobalPrototype(): boolean;
        setProt(obj: IStructurePrototype): advanced;
        getPrototype(): IStructurePrototype;
        getStructure(): JavaStructureDescription;
        isStructure(x: number, y: number, z: number, region?: BlockSource): boolean;
        isSetStructure(x: number, y: number, z: number, region?: BlockSource): boolean;
        is(x: number, y: number, z: number, region?: BlockSource): boolean;
        canSet(x: number, y: number, z: number, region?: BlockSource): boolean;
        setStructure(x: number, y: number, z: number, region?: BlockSource, packet?: any): advanced;
        set(x: number, y: number, z: number, region?: BlockSource, packet?: any): void;
        build(x: number, y: number, z: number, sleep: number, region: BlockSource, packet: any): advanced;
        destroy(x: number, y: number, z: number, region?: BlockSource): advanced;
        /** @deprecated */
        setStruct(name: string): advanced;
        /** @deprecated */
        setPrototype(obj: any): advanced;
    }
    /** @deprecated */
    function getRandomCoords(x: number, z: number, random: java.util.Random, obj?: {
        max?: number;
        min?: number;
    }): Vector;
    /** @deprecated */
    function setGlobalPrototype(name: string, obj: IStructurePrototype): void;
    /** @deprecated */
    function getGlobalPrototype(name: string): IStructurePrototype;
    /** @deprecated */
    function getStructure(name: string): JavaBlockData[];
    /** @deprecated */
    function addFeatureHandler(): void;
    /** @deprecated */
    function setStructureGeneration(): void;
    /** @deprecated */
    function getStructureGeneration(): void;
    /** @deprecated */
    namespace GenerateType {
        /** @deprecated */
        class OverworldFind {
        }
        /** @deprecated */
        class CustomDimensionFind {
        }
    }
}
declare let StructureUtilityJava: any;
declare let StructureRotation: any;
declare namespace StructureRotationJS {
    let DEFAULT: any;
    let DEGREES_90: any;
    let DEGREES_180: any;
    let DEGREES_270: any;
    let DEFAULT_DOWN: any;
    let DEGREES_90_DOWN: any;
    let DEGREES_180_DOWN: any;
    let DEGREES_270_DOWN: any;
    function getAll(): any;
    function getAllY(): any;
    function getAllDown(): any;
    function getRandomName(rotates: any, random: any): any;
}
declare namespace StructureUtility {
    function getStructureSize(name: any): any;
    function getStructureByName(name: any): JavaBlockData[];
    function newStructure(name: any, stru: any): void;
    function getCountBlock(stru: any): number;
    function rotate(stru: any, rotate: any): any;
    function registerRotationsRuntime(stru: any, rotates: any): void;
    function registerRotations(stru: any, rotates: any): void;
    function getAllStructureName(): any;
    function copy(name1: any, name2: any, prot: any): void;
    function getStructureByPos(pos: any, cen: any, value: any): JavaBlockData[];
    function generateShape(region: any, x: any, y: any, z: any, r: any, y_max: any, id: any, data: any, dirtId: any, dirtData: any, grassId: any, grassData: any): void;
    function generateShapeOptimization(region: any, name: any, x: any, y: any, z: any, r: any, id: any, data: any): void;
    function generateShapeOpti(region: any, x: any, y: any, z: any, r: any, id: any, data: any): void;
    function spawnEntity(region: any, x: any, y: any, z: any, ents: any, random: any): void;
    function addBlock(stru: any, x: any, y: any, z: any, state: any, extra: any, tag: any): void;
    function createBlock(x: any, y: any, z: any, state: any, extra: any, tag: any): JavaBlockData;
    function setBlock(stru: any, x: any, y: any, z: any, state: any, extra: any, tag: any): void;
    function getBlock(name: any, x: any, y: any, z: any): any;
    function getBlockIndex(name: any, x: any, y: any, z: any): any;
    function setBlockByIndex(name: any, i: any, x: any, y: any, z: any, state: any, extra: any, tag: any): void;
    function fill(x1: any, y1: any, z1: any, x2: any, y2: any, z2: any, block: any, region: any): void;
    function fillHandler(x1: any, y1: any, z1: any, x2: any, y2: any, z2: any, block: any, region: any, obj: any): void;
}
declare let JavaVisualStructure: any;
declare namespace VisualStructure {
    function getArrMesh(name: any, size: any, value: any): {
        state: BlockState;
        pos: number[];
    }[];
    function Animation(stru: any, size: any, value: any): void;
    function getRenderMesh(name: any): RenderMesh;
    function AnimationOptimization(name: any): void;
}
declare var __extends: any;
declare let ItemGenerationJava: any;
declare let GeneratorJava: any;
declare namespace ItemGeneration {
    function newGenerator(name: any): void;
    function register(name: any, generator: any): void;
    function isGenerator(name: any): boolean;
    function setItems(name: any, items: any): void;
    function getItems(name: any): any;
    function importFromFile(name: any, path: any): void;
    function addItem(name: any, id: any, random: any, count: any, data: any, extra: any): void;
    function setItemIntegration(id: any, random: any, count: any, data: any, extra: any): void;
    function setFillEmpty(name: any, value: any): void;
    function isFillEmpty(name: any): any;
    function setPrototype(name: any, obj: any): void;
    function getPrototype(name: any): any;
    function fill(name: any, x: any, y: any, z: any, random: any, region: any, packet: any): void;
    function registerRecipeViewer(generator: any, name: any): void;
    function enchantAdd(type: any, count: any): ItemExtraData;
}
declare namespace StructureIntegration {
    function registerTreeToBonsaiPots(sapling: any, stru: any, obj: any): void;
}
declare function StructureDescription(stru_name: any): void;
declare class StructureDescription {
    constructor(stru_name: any);
    cacheEnable: (value: any) => this;
    cacheUpdate: () => this;
    isCache: () => boolean;
    addBlock: (x: any, y: any, z: any, state: any) => this;
    getBlock: (x: any, y: any, z: any) => any;
    isBlock: (x: any, y: any, z: any) => boolean;
    getDescription: () => JavaStructureDescription;
    save: (name: any) => this;
    getBlocks: () => JavaBlockData[];
    setBlocks: (blocks: any) => this;
}
declare const StructurePieceController: typeof JavaStructurePieceController;
declare const DefaultDescription: typeof JavaDefaultGeneration;
declare const DUVector3: typeof com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3;
type GENERATION_TYPE = "default" | "Nether" | "OverWorld";
type STAND_NAME = "lasting" | "surface_tower";
interface ILegacyDescription {
    identifier?: string;
    type?: GENERATION_TYPE;
    save?: boolean;
    offset?: {
        x?: number;
        y?: number;
        z?: number;
    };
    structure: Structure.advanced;
    name?: string;
    chance: number;
    distance?: number;
    isSet?: boolean;
    dimension?: number;
    white_list?: boolean;
    biomes?: number[];
    white_list_blocks?: boolean;
    blocks?: number[];
    checkName?: boolean;
    optimization?: boolean;
    legacySpawn?: boolean;
    clearToMembory?: number;
    count?: number[];
    minAndMaxY?: [number, number];
    legacy_offset?: boolean;
    standName?: STAND_NAME;
}
type PacketMessage = {
    text: string;
};
declare let listPiece: IGenerationDescription[];
declare let reg: boolean;
declare class DefaultGenerationDescription {
    private readonly structure;
    private readonly chance;
    private readonly type;
    constructor(structure: Structure.advanced | JavaStructureDescription, chance: number, type?: GENERATION_TYPE);
    private dimension;
    private offset;
    private count;
    setGenerationParams(dimension?: number, x?: number, y?: number, z?: number, count?: number[]): DefaultGenerationDescription;
    private identifier;
    /**
     * Исправляет баг половинчитых структур, не рекомендуется использовать на структурах, которые генеруются часто, например деревья, т.к повышается потребление ОЗУ и ЦПУ
     * @param identifier - уникальный индификатор, по которому будет сохраняться структура, после выхода из мира, чтобы при возвращении в мир установить
     * @returns Возвращает самого себя
     */
    setIdentifier(identifier?: string): DefaultGenerationDescription;
    private distance;
    private name;
    private checkName;
    setDistance(distance?: number, name?: string, checkName?: boolean): DefaultGenerationDescription;
    private storage_structure;
    private queue_clear;
    private storage_queue;
    setStorage(storage_structure?: boolean, queue_clear?: boolean, storageQueue?: number): DefaultGenerationDescription;
    private check_place;
    private min_y;
    private max_y;
    setConditionsSpawned(check_place?: boolean, min_y?: number, max_y?: number): DefaultGenerationDescription;
    private biomes_white_list;
    private biomes;
    setBiomes(white_list?: boolean, list?: number[]): DefaultGenerationDescription;
    public setStand(stand: STAND_NAME): DefaultGenerationDescription
    private surface_white_list;
    private surface;
    /**
     * Рекомендую не использовать, плохая совместимость с серверным ядром на основе Nukkit-Mot
     * @param white_list - белый список или черный списое
     * @param list - список
     * @returns - возвращает самого себя
     */
    setSurface(white_list?: boolean, list?: number[]): DefaultGenerationDescription;
    clone(identifier?: string): DefaultGenerationDescription;
    build(): IGenerationDescription;
    register(): DefaultGenerationDescription;
}
declare namespace StructurePiece {
    function registerType(cl: IGenerationType): void;
    /**@deprecated */
    function getDefault(obj: ILegacyDescription): IGenerationDescription;
    function generateStructure(stru: IGenerationDescription, x: number, y: number, z: number, random: java.util.Random, region: BlockSource, packet?: any): void;
    function register(stru: IGenerationDescription): void;
    function getNearestStructure(x: number, y: number, z: number, region: BlockSource, name?: string, checkName?: boolean): JavaWorldStructure;
    function addStructure(name: string, x: number, y: number, z: number, region: BlockSource): void;
    function deleteStructure(x: number, y: number, z: number): void;
}

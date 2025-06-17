declare namespace com {
    namespace zhekasmirnov {
        namespace apparatus {
            namespace adapter {
                namespace innercore {
                    namespace game {
                        namespace common {
                            class Vector3 extends java.lang.Object {
                                public readonly x: number;
                                public readonly y: number;
                                public readonly z: number;

                                constructor(x: number, y: number, z: number);
                                
                                lengthSqr(): number;
                                length(): number;
                                distanceSqr(pos: Vector3): number;
                                distance(pos: Vector3): number;
                            }
                        }
                    }
                }
            }
        }
    }
}

declare class JavaWorldStructure extends java.lang.Object {
    public readonly dimension: number;
    public readonly pos: JavaVector3;
    public readonly name: string;

    constructor(pos: JavaVector3, name: string, dimension: string);
}

// type JavaBlockState = com.zhekasmirnov.apparatus.adapter.innercore.game.block.BlockState;
type JavaBlockState = BlockState;
type JavaVector3 = com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3;
type Random = java.util.Random;

declare class JavaBlockData extends java.lang.Object {
    public x: number;
    public y: number;
    public z: number;
    public state: Nullable<JavaBlockState>;
    public stateExtra: Nullable<JavaBlockState>;
    public tag: Nullable<NBT.CompoundTag>;

    constructor(x: number, y: number, z: number, state: JavaBlockState, extra: JavaBlockData, tag: NBT.CompoundTag);
    constructor(x: number, y: number, z: number, state: JavaBlockState, extra: JavaBlockData);
    constructor(x: number, y: number, z: number, state: JavaBlockState);
    constructor(x: number, y: number, z: number);
    constructor(data: JavaBlockData);

    clone(): JavaBlockData;
    set(x: number, y: number, z: number, region: BlockSource);
    isBlock(x: number, y: number, z: number, region: BlockSource);
    getName(): string;
    getData(): JavaBlockData;

    isState(): boolean;
    isExtra(): boolean;
    isTag(): boolean;

    static createData(x: number, y: number, z: number, block: Nullable<JavaBlockState>, extra: Nullable<JavaBlockState>, tag: Nullable<NBT.CompoundTag>): JavaBlockData;
    static createData(x: number, y: number, z: number, block: Nullable<JavaBlockState>, extra: Nullable<JavaBlockState>): JavaBlockData;
    static createData(x: number, y: number, z: number, block: Nullable<JavaBlockState>): JavaBlockData;
    static createData(x: number, y: number, z: number): JavaBlockData;
    static createData(block: Nullable<JavaBlockState>): JavaBlockData;
    static getBlockByCoords(x: number, y: number, z: number, region: BlockSource): JavaBlockData;
}

declare class JavaStructureDescription extends java.lang.Object  {
    public blocks: JavaBlockData[];
    public prot: IStructurePrototype;

    constructor(blocks: JavaBlockData[], prot: IStructurePrototype);
    constructor(blocks: JavaBlockData[]);
    constructor(stru: JavaStructureDescription);

    clone(): JavaStructureDescription;

    set(x: number, y: number, z: number, region: BlockSource, addProt: IStructurePrototype, use: boolean, packet: any);
    set(x: number, y: number, z: number, region: BlockSource);

    build(x: number, y: number, z: number, region: BlockSource, addProt: IStructurePrototype, use: boolean, packet: any, sleep: number);
    build(x: number, y: number, z: number, region: BlockSource, sleep: number);

    isSetStructure(x: number, y: number, z: number, region: BlockSource): boolean;
    isStructure(x: number, y: number, z: number, region: BlockSource): boolean;
    destroy(x: number, y: number, z: number, region: BlockSource): boolean;
}

declare interface IStructurePrototype {
    before(x: number, y: number, z: number, region: BlockSource, packet: any): void;
    isBlock(orgPos: JavaVector3, data: JavaBlockData, region: BlockSource, packet: any): boolean;
    setBlock(orgPos: JavaVector3, data: JavaBlockData, region: BlockSource, packet: any): void;
    after(x: number, y: number, z: number, region: BlockSource, packet: any): void;
}

declare class JavaStructureDestructibility extends java.lang.Object {
    constructor();

    public addBlock(id: number, state: JavaBlockState): JavaStructureDestructibility;
    public getMap(): java.util.HashMap<java.lang.Integer, java.util.ArrayList<JavaBlockData>>;
}

declare class JavaDefaultStructurePrototype extends java.lang.Object implements IStructurePrototype {
    constructor(item_generation_name: string, blocks: JavaStructureDestructibility);

    public before(x: number, y: number, z: number, region: BlockSource, packet: any): void;
    public isBlock(orgPos: JavaVector3, data: JavaBlockData, region: BlockSource, packet: any): boolean;
    public setBlock(orgPos: JavaVector3, data: JavaBlockData, region: BlockSource, packet: any): void;
    public after(x: number, y: number, z: number, region: BlockSource, packet: any): void;
}

declare class JavaBaseStand {
    public setName(name: string): void;
    public getName(): string;
    public setStand(region: BlockSource, x: number, y: number, z: number): void;
}

declare class JavaStructure {
    /** @deprecated */
    static setStructure(stru: JavaStructureDescription, x: number, y: number, z: number, region: BlockSource, packat: any): void;
    /** @deprecated */
    static build(stru: JavaStructureDescription, x: number, y: number, z: number, region: BlockSource, sleep: number, packat: any): void;
    /** @deprecated */
    static isStructure(stru: JavaStructureDescription, x: number, y: number, z: number, region: BlockSource): boolean;
    /** @deprecated */
    static isSetStructure(stru: JavaStructureDescription, x: number, y: number, z: number, region: BlockSource): boolean;
    /** @deprecated */
    static destroy(stru: JavaStructureDescription, x: number, y: number, z: number, region: BlockSource): boolean;
    /** @deprecated */
    static setGlobalPrototype(name: string, prot: IStructurePrototype): boolean;
    /** @deprecated */
    static getGlobalPrototype(name: string): IStructurePrototype;

    constructor(stru: JavaStructureDescription);

    setUseGlobalPrototype(value: boolean): void;
    isUseGlobalPrototype(): boolean;

    setPrototype(prot: IStructurePrototype): void;
    getPrototype(): IStructurePrototype;

    getStructure(): JavaStructureDescription;
    setStructure(stru: JavaStructureDescription): void;

    isStructure(x: number, y: number, z: number, region: BlockSource): boolean;
    isSetStructure(x: number, y: number, z: number, region: BlockSource): boolean;
    setStructure(x: number, y: number, z: number, region: BlockSource, packat: any): void;
    build(x: number, y: number, z: number, region: BlockSource, sleep: number, packat: any): void;
    destroy(x: number, y: number, z: number, region: BlockSource): boolean;
    setStand(stand: JavaBaseStand): void
    getStand(): Nullable<JavaBaseStand>;
}

interface IGenerationDescription {
    getStructure(): JavaStructure;
    getChance(): number;
    getType(): string;
    isGeneration(pos: JavaVector3, random: Random, dimension: number, region: BlockSource): boolean;
    isPoolStructure(pos: JavaVector3, random: Random, dimension: number, region: BlockSource): boolean;
    getName(): string;
    getDistance(): number;
    isSet(): boolean;
    getOffset(): JavaVector3;
    checkName(): boolean;
    canOptimization(): boolean;
    canLegacySpawn(): boolean;
    getTimeClearToMembory(): number;
    getCount(): number[];
    getMinAndMaxY(): [number, number];
    canClearStructure(): boolean;
    canLegacyOffset(): boolean;
    getUniqueIdentifier(): string;
    getStandName(): string;
}

interface IGenerationType {
    getType(): string;
    isGeneration(pos: JavaVector3, random: Random, dimension: number, region: BlockSource): boolean;
    getPosition(chunkX: number, chunkZ: number, random: Random, dimension: number, region: BlockSource): JavaVector3;
}

interface IStructurePiece {
    addGeneration(stru: IGenerationDescription): void;
    registerType(type: IGenerationType): void;
    generation(chunkX: number, chunkZ: number, random: Random, dimension: number): void;
    spawnStructure(description: IGenerationDescription, pos: JavaVector3, region: BlockSource, packet: any, random: Random, dimension: number);
}

interface IStructureStorage {
    getStructures(): JavaWorldStructure[];
    setStructures(structures: JavaWorldStructure[]): void;
    clear(): void;
    add(stru: JavaWorldStructure);
    add(name: string, x: number, y: number, z: number, region: BlockSource);
    del(x: number, y: number, z: number);
    getNearestStructure(pos: JavaVector3, dimension: number, name: string, is: boolean): JavaWorldStructure;
}

interface IChunk {
    getDimension(): number;
    getX(): number;
    getZ(): number;
    getTime(): number;
    canClear(): boolean;
    setCanClear(value: boolean): void;
    free(): void;
}

interface IChunkManager {
    getDimensions(): number[];
    add(chunk: IChunk): void;
    add(dimension: number, x: number, z: number);
    isChunckLoaded(dimension: number, x: number, z: number): boolean;
    remove(dimension: number): IChunk;
    at(dimension: number, x: number, z: number): IChunk;
    canSpawn(dimension: number, startX: number, startZ: number, endX: number, endZ: number): boolean;
    setNotClear(dimension: number, startX: number, startZ: number, endX: number, endZ: number): void;
    getCount(): number;
    getCount(dimension: number): number;
    clear(): void;
}

declare class JavaDefaultGeneration extends java.lang.Object implements IGenerationDescription {
    constructor(type: string, name: string, x: number, y: number, z: number, chance: number, disnatnt: number, pool: boolean, isSet: boolean, dimension: number, white_list: boolean, biomes: number[], white_list_blocks: boolean, blocks: number[], structure: JavaStructure, checkName: boolean, optimization: boolean, legacy: boolean, time: number, count: number[], minAndMaxY: number[], canLegacyOffset: boolean, identifier: string, standName: string);
    public getUniqueIdentifier(): string;
    public getStandName(): string;
    public getStructure(): JavaStructure;
    public getChance(): number;
    public getType(): string;
    public isGeneration(pos: JavaVector3, random: Random, dimension: number, region: BlockSource): boolean;
    public isPoolStructure(pos: JavaVector3, random: Random, dimension: number, region: BlockSource): boolean;
    public getName(): string;
    public getDistance(): number;
    public isSet(): boolean;
    public getOffset(): JavaVector3;
    public checkName(): boolean;
    public canOptimization(): boolean;
    public canLegacySpawn(): boolean;
    public getTimeClearToMembory(): number;
    public getCount(): number[];
    public getMinAndMaxY(): [number, number];
    public canClearStructure(): boolean;
    public canLegacyOffset(): boolean;
}

interface IJavaAlgoritm {
    run(pos: JavaVector3, structures: JavaWorldStructure[]): void;
}

declare class JavaAlgoritms extends java.lang.Object {
    public addAlgoritm(base: IJavaAlgoritm): void;

    public setTime(time: number): void;
    public addPos(pos: JavaVector3): void;
    public algorithmsOptimization(pos: JavaVector3): void;
}

declare class JavaStructurePieceController {
    static setTypePiece(type: string): void;
    static getPiece(): IStructurePiece;
    static getPiece(type: string): IStructurePiece;

    static setTypeStorage(type: string): void;
    static getStorage(): IStructureStorage;

    static setTypeChunkManager(type: string): void;
    static getChunkManager(): void;

    static getPieces(): string[];

    static algorithms: JavaAlgoritms

    /** @deprecated */
    static generationChunck(x: number, z: number, random: java.util.Random, dimension: number): void;
}

declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.generation.StructurePieceController"): typeof JavaStructurePieceController;
declare function WRAP_JAVA(path: "com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3"): typeof com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.generation.types.api.WorldStructure"): typeof JavaWorldStructure;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.Structure"): typeof JavaStructure;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.api.StructureDescription"): typeof JavaStructureDescription;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.api.data.BlockData"): typeof JavaBlockData;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.generation.types.api.DefaultGeneration"): typeof JavaDefaultGeneration;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.prototypes.DefaultStructurePrototype"): typeof JavaDefaultStructurePrototype;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.prototypes.StructureDestructibility"): typeof JavaStructureDestructibility;

interface ILogger {
    debug(text: string): void;
    open(): void;
    close(): void;
    updateСhart(key: string, title: string, value: number): void;
    error(error: java.lang.Exception): void;
    canEnable(key: string): boolean;
    setEnable(key: string, enable: boolean): void;
    setAdditionSetting(setting: {[key: string]: number}): void;
}

declare class JavaLoggerDisable extends java.lang.Object implements ILogger {
    public setAdditionSetting(setting: { [key: string]: number; }): void;
    public debug(text: string): void;
    public open(): void;
    public close(): void;
    public updateСhart(key: string, title: string, value: number): void;
    public error(error: java.lang.Exception): void;
    public canEnable(key: string): boolean;
    public setEnable(key: string, enable: boolean): void;
}

declare class JavaLoggerEnable extends java.lang.Object implements ILogger {
    public setAdditionSetting(setting: { [key: string]: number; }): void;
    public debug(text: string): void;
    public open(): void;
    public close(): void;
    public updateСhart(key: string, title: string, value: number): void;
    public error(error: java.lang.Exception): void;
    public canEnable(key: string): boolean;
    public setEnable(key: string, enable: boolean): void;
}

declare class JavaDebug {
    static get(): ILogger;
    static set(logger: ILogger): void;
}

declare function WRAP_JAVA(path: "com.reider.dungeonutility.logger.Debug"): typeof JavaDebug;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.logger.LoggerDisable"): typeof JavaLoggerDisable;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.logger.LoggerEnable"): typeof JavaLoggerEnable;

type ROTATION = number;

declare namespace JavaStructureRotation {
    export const DEFAULT: ROTATION;
    export const DEGREES_90: ROTATION;
    export const DEGREES_180: ROTATION;
    export const DEGREES_270: ROTATION;
    export const DEFAULT_DOWN: ROTATION;
    export const DEGREES_90_DOWN: ROTATION;
    export const DEGREES_180_DOWN: ROTATION;
    export const DEGREES_270_DOWN: ROTATION;

    export function getAll(): ROTATION[];
    export function getAllY(): ROTATION[];
    export function getAllYDown(): ROTATION[];

    export function getRandomName(rotations: ROTATION[], random: Random): string;
    export function getRandomName(rotations: ROTATION[]): string;
}









type FILE_FORMATS = "DungeonAPI" | "DungeonAPI_V2" | "DungeonCore" | "Structures" | "DungeonUtility" | "DungeonUtility_V2" | "nbt" | "DU" | "DU2";

declare class JavaStructureRegisterLoader {
    public add(name: string, path: string, type: FILE_FORMATS, compression: boolean): void;
    public loaded(): void;
}

interface IStructureCopy {
    copyBlock(block: JavaBlockData): JavaBlockData;
    copyPrototype(prot: IStructurePrototype): IStructurePrototype;
}

declare class JavaStructurePool {
    constructor(name: string, global: boolean);
    constructor(name: string);

    public getName(): string;
    public getLoader(): JavaStructureRegisterLoader;
    public setPathStructures(path: string): void;
    public getStructure(name: string): JavaStructureDescription;  
    public setStructure(name: string, structure: JavaStructureDescription): void;
    public getStructures(): java.util.HashMap<string, JavaStructureDescription>;
    public getAllStructure(): string[];

    public load(name: string, path: string, type: FILE_FORMATS, compression: boolean): void;
    public loadRuntime(name: string, path: string, type: FILE_FORMATS, compression: boolean): void;
    public isLoad(name: string): boolean;
    public deLoad(name: string): void;

    public copy(name1: string, name2: string, controller: IStructureCopy): void;
    public registerRotations(stru: JavaStructureDescription, name: string, rotates: ROTATION[]): void;
    public setGlobalPrototype(name: string, structure: IStructurePrototype): void;
}

declare namespace JavaStructureLoader {
    export function getStructurePoolByName(name: string): Nullable<JavaStructurePool>;
    export function getStructurePool(name: string): JavaStructurePool;
    export function getAllPool(): string[];
    export function getAllStructureAndPool(): java.util.HashMap<string, string[]>;
    export function registerPool(pool: JavaStructurePool): void;

    /** @deprecated */
    export function load(name: string, path: string, type: FILE_FORMATS, compression: boolean): void;
    /** @deprecated */
    export function loadRuntime(name: string, path: string, type: FILE_FORMATS, compression: boolean): void;
    /** @deprecated */
    export function getStructure(name: string): JavaStructureDescription;
    /** @deprecated */
    export function isStructureLoad(name: string): boolean;
    /** @deprecated */
    export function getAllStructureName(): string[];
    /** @deprecated */
    export function deLoad(name: string): void;
}

declare class JavaStructureCompression {
    static compression(path: string, content: string): void;
    static decompression(path: string): string;
}

declare class BlockPalette {
    }

interface ILoaderType {
    read(file: number[], path: string, palette: BlockPalette): void;
    save(stru: JavaStructureDescription): number[];
    isLoadRuntime(): boolean;
}

declare class JavaLoaderType {
    static registerType(name: string, type: ILoaderType): void
    static getType(name: string): ILoaderType;
    static getTypes(): string[];
}

declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.loaders.StructurePool"): typeof JavaStructurePool;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.loaders.StructureLoader"): typeof JavaStructureLoader;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.formats.StructureCompression"): typeof JavaStructureCompression;
declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.formats.LoaderType"): typeof JavaLoaderType;

declare namespace JavaUtils {
    export function readFileBytes(path: string): number[];
    export function writeFileBytes(path: string, bytes: number[]): void;
}

declare function WRAP_JAVA(path: "com.reider.dungeonutility.api.Utils"): typeof JavaUtils;

declare class JavaCompatibilityBase {
    constructor(map: java.util.HashMap<Object, Object>);

    public parseZones(buffer: java.nio.ByteBuffer): void;
    public readZones(buffer: java.nio.ByteBuffer): void;
    public toString(): java.lang.String;
}

declare function WRAP_JAVA(path: "com.reider.dungeonutility.struct.formats.du_v2.compatibility.CompatibilityBase"): typeof JavaCompatibilityBase;
declare class Dependence {
    constructor(name: string, prioiry?: number);

    public addDependence(mod_api: string, url?: string, unification?: (input_api: any, output_api: any)=> void, isLoader?: (api) => boolean, customMessage?: (api) => string): Dependence;
    public setLaunch(func: (all_api: any, api: any) => void);
}
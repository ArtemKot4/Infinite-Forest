declare namespace LearningType {

    export type Item = (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) => boolean;
    export type CraftBuild = (stack: ItemStack[]) => boolean;

};

class Learning {
    public static list = {} as Record<string, Record<string, LearningBase<any>>>;

    public static add<T extends LearningBase<any>>(learning: T): void {

        const list = Learning.list[learning.getType()] ??= {};

        list[learning.getName()] ??= learning;

    };

    public static has(player: number, name: string): boolean {
        return Flags.getFor(player).learningList.has(name);
    };

    public static isValid(name: string): boolean {
        
        return !!Learning.find(name);

    };

    public static find(name: string): LearningBase<any> {

        for(const i in Learning.list) {

            const find = Object.values(Learning.list[i]).find((v) => name in v);

            if(!!find) {
                return find[name];
            };

        };

        return null;
    }
    
    public static addFor(player: number, learning: string, ...args: unknown[]): void {
            const findLearning = Learning.find(learning);

            if(!findLearning) {
                throw new NoSuchFieldException("error with adding learning for player: learning is not exists")
            };

            findLearning.complete(player, args);
            return;
    };

};

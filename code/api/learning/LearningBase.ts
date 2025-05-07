abstract class LearningBase {
    public page: string;
    public icon: string;
    public section: string;
    public iconType: 'item' | 'default';

    constructor(public name: string, data: { 
        page: string, 
        section?: string,
        icon?: string,
        iconType?: 'item' | 'default',
    }) {
        this.page = data.page;
        this.section = data.section || 'default';
        this.icon = data.icon;
        this.iconType = data.iconType;

        Learning.list[name] = this;
    };

    abstract type: string;

    public dependences: string[];

    public static condition?(...args: unknown[]): boolean;

    public static completeEvent?(player: number, ...args: Parameters<typeof this.condition>): any;

    public static complete<T extends LearningBase>(learning: T, player: number, ...args: Parameters<typeof this.condition>): void {
        const list = ObjectPlayer.get(player).learnings;

        if (learning.name in list) {
            return;
        }

        if (Array.isArray(learning.dependences) && learning.dependences.length > 0) {
            for (const dependence of learning.dependences) {
                if (!(dependence in list)) {
                    return;
                }
            }
        }

        if (this.condition && !this.condition(...args)) {
            return;
        };

        if(this.completeEvent) {
            this.completeEvent(player, ...args);
        };

        Learning.giveFor(player, learning.name);
        return;
    };
};
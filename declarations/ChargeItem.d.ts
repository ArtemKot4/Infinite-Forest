interface IElectricItem {
    /** Type of energy stored in item */
    energy: string;
    /** If true, energy can be extracted from item */
    canProvideEnergy: boolean;
    /** Tier of item. Specifies where item can be charged or discharged. */
    tier: number;
    /** Energy capacity of item */
    maxCharge?: number;
    /** Defines limit for transfering energy in item per 1 time */
    transferLimit?: number;
    /** Amount of energy stored in flash items */
    amount?: number;
    /** Custom action on charge */
    onCharge?(item: ItemInstance, amount: number, tier: number, addAll?: boolean): number;
    /** Custom action on discharge */
    onDischarge?(item: ItemInstance, amount: number, tier: number, getAll?: boolean): number;
}

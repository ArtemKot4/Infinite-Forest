declare namespace ChargeItemRegistry {
    let chargeData: {
        [key: number]: IElectricItem;
    };
    function registerItem(id: number, itemData: IElectricItem, inCreative?: boolean): void;
    function registerItem(id: number, energyType: string, capacity: number, transferLimit: number, tier?: number, canProvideEnergy?: boolean, inCreative?: boolean): void;
    function registerFlashItem(id: number, energyType: string, amount: number, tier?: number): void;
    /** @deprecated Use registerItem instead */
    function registerExtraItem(id: number, energyType: string, capacity: number, transferLimit: number, tier: number, itemType?: string, addScale?: boolean, addToCreative?: boolean): void;
    function addToCreative(id: number, energy: number): void;
    function registerChargeFunction(id: number, func: IElectricItem["onCharge"]): void;
    function registerDischargeFunction(id: number, func: IElectricItem["onDischarge"]): void;
    function getItemData(id: number): IElectricItem;
    function isFlashStorage(id: number): boolean;
    function isValidItem(id: number, energyType: string, tier: number): boolean;
    function isValidStorage(id: number, energyType: string, tier: number): boolean;
    function getMaxCharge(id: number, energyType?: string): number;
    function getDisplayData(energy: number, maxCharge: number): number;
    function getEnergyStored(item: ItemInstance, energyType?: string): number;
    function setEnergyStored(item: ItemInstance, amount: number): void;
    function getEnergyFrom(item: ItemInstance, energyType: string, amount: number, tier: number, getAll?: boolean): number;
    function getEnergyFromSlot(slot: any, energyType: string, amount: number, tier: number, getAll?: boolean): number;
    function addEnergyTo(item: ItemInstance, energyType: string, amount: number, tier: number, addAll?: boolean): number;
    function addEnergyToSlot(slot: any, energyType: string, amount: number, tier: number, addAll?: boolean): number;
    function transferEnergy(api: any, field: any, result: ItemInstance): void;
}

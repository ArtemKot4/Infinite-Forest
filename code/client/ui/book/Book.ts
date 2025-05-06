interface IWorkbenchPage {
    type: "workbench",
    description: string,
    pattern: [
        string, 
        string, 
        string
    ], 
    input: Record<string, ItemInstance>,
    result: ItemInstance
}

interface ICauldronPage {
    type: "cauldron",
    description: string,
    input: ItemInstance[],
    result: ItemInstance,
    learnings?: string[],
    reflections?: string[],
    secretCount: number
}

interface IWindmillPage {
    type: "windmill",
    description: string,
    input: ItemInstance[],
    result: ItemInstance,
    learnings?: string[],
    reflections?: string[]
}

interface IFeelingPage {
    type: "feeling",
    title: string,
    subtitle: string,
    description: string
}

interface IDefaultPage {
    type: "default",
    title: string,
    subtitle: string,
    description: string,
    elements: UI.ElementSet
}

type PageDescription = IWorkbenchPage | ICauldronPage | IWindmillPage;
type BookSection = "default" | "feelings" | "workbench" | "cauldron" | "windmill";

abstract class Book {
    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);
        window.setDynamic(true);
        return window;
    })();

    current: string;
    sections: {
        index: number,
        pages: PageDescription[]
    }
}
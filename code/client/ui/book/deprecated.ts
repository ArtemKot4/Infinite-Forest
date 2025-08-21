// interface IMarkdownHeadings {
//     first?: number,
//     second?: number,
//     third?: number,
//     fourth?: number
// }

// interface IMarkdownTextDescription {
//     font: string,
//     headingSize: IMarkdownHeadings
//     lineSize: number
// }

// class UIMarkdownTextElement implements UI.UICustomElement {
//     public font: string;
//     public headingSize: IMarkdownHeadings;
//     public lineSize: number;

//     public constructor(public text: string, public x: number, public y: number, description?: IMarkdownTextDescription) {
//         this.font = description.font //|| not work FileTools.getMcTypeface();
//         this.headingSize = description.headingSize;
//         this.lineSize = description.lineSize || 50;
//     }
//     public type: "custom" = "custom";

//     onSetup(element: UI.UICustomElement): void {

//     }
//     onDraw(element: UI.UICustomElement, canvas: android.graphics.Canvas, scale: number): void {};
//     onBindingUpdated<T>(element: UI.UICustomElement, name: string, val: T): void {};

//     public static separateText(text: string, lineSize: number = 25): string {
//         let result: string[] = [];
//         let line = "";
    
//         for (let word of text.split(" ")) {
//             if (line.length + word.length <= lineSize) {
//                 line += word + " ";
//             } else {
//                 result.push(line.trim());
//                 line = word + " ";
//             }
//         }
    
//         if (line) {
//             result.push(line.trim());
//         }
    
//         return result.join("\n");
//     }
// }
/**
 * Thank you for downloading library!
 * Author: ArtemKot
 * Year: 2025
 */
Translation.addTranslation("component.message.browser_link_title", {
    en: "Switching to browser",
    ru: "Переход в браузер"
});

Translation.addTranslation("component.message.browser_link_message", {
    en: "Element ask switching by link",
    ru: "Элемент запрашивает переход по ссылке"
});

Translation.addTranslation("component.message.browser_link_button", {
    en: "Перейти",
    ru: "Switch"
});

namespace UI {
    export const DRAWING_TYPES = [
        "background",
        // "text",
        "line",
        "bitmap",
        // "frame",
        // "custom"
    ];
    export interface ClickerEvents {
        onClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
        onLongClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void
    }
    export interface CustomEvents {
        onSetup?: (element: UICustomElement) => void,
        onDraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void,
        onTouchReleased?: (element: UICustomElement) => void,
        onBindingUpdated?: <T>(element: UICustomElement, name: string, val: T) => void,
        onReset?: (element: UICustomElement) => void,
        onRelease?: (element: UICustomElement) => void,
        onContainerInit?: (element: UICustomElement, container: UI.Container, elementName: string) => void
    }
    /**
     * Namespace to manipulate your jsx, tsx and provide it to function calls.
     */
    export namespace JSX {
        export type ImageLink = {
            src: string
        }
        export type ImageLinks = ImageLink & {
            src2: string
        }
        export type Element = (
            (UICustomElement & CustomEvents)
            | UIButtonElement & ImageLinks
            | UICloseButtonElement & ImageLinks
            | UIFrameElement & ImageLink 
            | UIImageElement & ImageLinks
            | UIScaleElement & ImageLink
            | UIScrollElement
            | UISlotElement & ImageLink
            | UITextElement
        ) & ClickerEvents & StyleProperties & { 
            name?: string;
            id?: string
            href?: string
            hrefLong?: string
        }
        export type Elements = Record<string, Element>;
        export interface WindowProperties {
            width?: number;
            height?: number
            scale?: number;
            background?: number;
            x?: number;
            y?: number;
            scrollX?: number;
            scroolY?: number;
            forceScrollX?: boolean;
            forceScrollY?: boolean;
            globalScale?: boolean;
            overlay?: boolean;
            dynamic?: boolean;
            touchable?: boolean;
            inventoryNeeded?: boolean;
            blockingBackground?: boolean;
            closeOnBackPressed?: boolean;
            alpha?: number;
            onOpen?(window: UI.IWindow);
            onClose?(window: UI.IWindow);
        }
        export type Node = (Elements | WindowNode | StandardWindowNode)[];
        export type ElementNode = Elements[];
        export type ElementProperties = Nullable<Element>;
        export type WindowNode = Nullable<{
            elements?: UI.ElementSet;
            drawing?: UI.DrawingSet;
        }>;
        export type ExtendedWindowNode = WindowNode & {
            params?: com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet;
            style?: com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet;
        };
        export type StandardWindowNode = ExtendedWindowNode & { 
            standard?: com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowParams;
        };
        export type Properties = ElementProperties | WindowProperties | UI.DrawingElements | DivProperties;
        export type FC<T extends Element = Element> = (properties?: T, ...children: T[]) => T;
        export type Tag = FC<any> | (
            "custom" | "button" | "closeButton" | 
            "close_button" | "frame" | "image" | 
            "scale" | "scroll" | "slot" | 
            "switch" | "tab" | "text" | 
            "fps" | "invSlot" | "invslot" | 
            "window" | "standardWindow" | "standartWindow" | 
            "elements" | "drawing" | "standard" |
            "params" | "style" | "div"
        ); 
        export const divClasses: Record<string, StyleProperties> = {};

        export class PropertiesError extends Error {
            public constructor(message: string) {
                super(message);
                this.name = "PropertiesError";
            }
        }

        export function getBitmapFromPath(path: string): Nullable<android.graphics.Bitmap> {
            path = path.replace(new RegExp("__dir__", "g"), __dir__);
            try {
                return FileTools.ReadImage(path);
            } catch(e) {
                Logger.Log(`Bitmap from path "${path}" is not exists`, "Component");
                return null;
            }
        }

        export function openLink(url: string): void {
            if (!url.startsWith("http://") && !url.startsWith("https://")){
                url = "http://" + url;
            }
            
            const context = getContext();
            new android.app.AlertDialog.Builder(context)
            .setTitle(Translation.translate("component.message.browser_link_title"))
            .setMessage(Translation.translate("component.message.browser_link_message"))
            .setPositiveButton(Translation.translate("component.message.browser_link_button"), new android.content.DialogInterface.OnClickListener({
                onClick() {
                    try {
                        const intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
                        context.startActivity(intent);
                    } catch {
                        alert(`Error with opening ${url}`);
                    }
                }
            }))
            .setCancelable(true);
        }

        export function getClickFunctionForLink(link: string, onClick?: com.zhekasmirnov.innercore.api.mod.ui.elements.UIClickEvent["onClick" | "onLongClick"]) {
            return function(position: Vector, container: Container | ItemContainer, tileEntity: any, window: IWindow, canvas: android.graphics.Canvas, scale: number) {
                openLink(link);
                if(onClick != null) {
                    return onClick(position, container, tileEntity, window, canvas, scale);
                }
                return;
            } 
        }

        export function parseWindowContent(properties: WindowProperties, children: WindowNode): UI.WindowContent {//UI.IWindow 
            const content: UI.StandardWindowContent = {
                location: {
                    x: properties.x || 0,
                    y: properties.y || 0,
                    width: Number(properties.width) || 0,
                    height: Number(properties.height) || 0,
                    scrollX: Number(properties.scrollX || 0),
                    scrollY: Number(properties.scroolY || 0),
                    forceScrollX: properties.forceScrollX || false,
                    forceScrollY: properties.forceScrollY || false,
                    globalScale: properties.globalScale || false
                },
                drawing: children.drawing || [],
                elements: children.elements || {}
            };
            if(properties.background != null) {
                content.drawing.push({
                    type: "background",
                    color: properties.background
                });
            }
            //window.content = content;
            return content//window;
        }

        export function parseWindow(tag: "window", properties: WindowProperties, children: WindowNode[]): UI.WindowContent {//UI.Window {
            const data: WindowNode = {};

            for(const i in children) {
                Object.assign(data, children[i]);
            }
            const window = new UI.Window();
            window.setContent(parseWindowContent(properties, data));

            window.setBlockingBackground(properties.blockingBackground || false);
            window.setCloseOnBackPressed(properties.closeOnBackPressed || false);
            window.setAsGameOverlay(properties.overlay || false);
            window.setDynamic(properties.dynamic || true);
            window.setTouchable(properties.touchable || true);
            window.setInventoryNeeded(properties.inventoryNeeded || false);
            window.setEventListener({
                onOpen(window) {
                    if(properties.alpha) {
                        window.layout.setAlpha(properties.alpha);
                    }
                    if("onOpen" in properties) {
                        return properties.onOpen(window);
                    }
                },
                onClose(window) {
                    if("onClose" in properties) {
                        return properties.onClose(window);
                    }
                }
            });
            return window//parseWindowContent(properties, data)//window;
        }

        export function parseStandardWindow(properties: WindowProperties, children: StandardWindowNode[]): UI.WindowContent {//{UI.StandardWindow {
            const window = new UI.StandardWindow();
            const data: StandardWindowNode = {};

            for(const i in children) {
                Object.assign(data, children[i]);
            }
            const content: UI.StandardWindowContent = parseWindowContent(properties, data);

            if("standard" in children) {
                content.standard = data.standard;
            }
            if("params" in children) {
                content.params = data.params;
            }
            if("style" in children) {
                content.style = data.style;
            }
            window.setContent(content);
            window.setBlockingBackground(properties.blockingBackground || false);
            window.setCloseOnBackPressed(properties.closeOnBackPressed || false);
            return content//window;
        }

        export function parseElement(tag: string, properties: ElementProperties, children: Node): UI.Element {
            let type = tag == "element" ? properties.type || "custom" : tag == "picture" ? "image" : tag;
            
            if(type == "text") {
                properties.text = properties.text || children.toString();
            }
            if(properties.name == null) {
                if(tag == "frame" || tag == "text" || tag == "custom") {
                    return parseDrawing(tag, properties as UI.DrawingElements, children);
                }
            }
            if(type != "text") {
                if(!("bitmap" in properties)) {
                    properties.bitmap = properties.src != null ? getBitmapFromPath(properties.src) : children.toString();
                }
                if(!("bitmap2" in properties) && properties.src2 != null) {
                    properties.bitmap2 = getBitmapFromPath(properties.src2);
                }
            }

            properties.clicker = {};
            properties.clicker.onClick = properties.href ? getClickFunctionForLink(properties.href, properties.onClick) : properties.clicker.onClick || null;
            properties.clicker.onLongClick = properties.hrefLong ? getClickFunctionForLink(properties.hrefLong, properties.onLongClick) : properties.onLongClick || null;
            if(!properties.type) {
                properties.type = type as any;
            }
            if(tag == "element") {
                return properties;
            } 
            return {
                [properties.name || String(java.util.UUID.randomUUID())]: properties
            }
        }

        export function parseDrawing(tag: string, properties: UI.DrawingElements, children: Node): UI.DrawingElements {
            properties.type = tag as any;
            return properties;
        }

        export function parse(tag: Tag, properties: Properties, ...children: Node): UI.Element | UI.ElementSet | UI.IWindow {
            if(typeof tag == "function") {
                return tag({ ...properties }, ...children);
            }
            if(!properties) {
                properties = {};
                //if your component's must contain any properties, delete comment below.
                //throw new PropertiesError(`Params of element "${children}" can't be empty`);
            }
            if(tag == "window") {
                return parseWindow(tag, properties as WindowProperties, children);
            }
            if(tag == "standardWindow" || tag == "standartWindow") {
                return parseStandardWindow(properties as WindowProperties, children);
            }
            if(tag == "drawing") {
                return {
                    drawing: children
                }
            }
            if(tag == "elements") {
                return {
                    elements: rebuildElementSet(getElementSetFrom(children as Elements[]))
                }
            }
            if(tag == "params") {
                return {
                    params: children
                }
            }
            if(tag == "style") {
                return {
                    style: children
                }
            }
            if(tag == "standard") {
                return {
                    standard: children
                }
            }
            // if(tag == "div") {
            //     return getElementSetWithDiv(properties as DivProperties, children as Elements[]);
            // } 
            //todo: write full div logic
            if(DRAWING_TYPES.includes(tag)) {
                return parseDrawing(tag, properties as UI.DrawingElements, children);
            }
            return parseElement(tag, properties as ElementProperties, children);
        }

        export function deleteGarbage(element: Element): void {
            /* this keys can be used to rebuild.
            delete element.marginLeft;
            delete element.marginRight;
            delete element.marginTop;
            delete element.marginBottom;
            delete element.id;
            */

            // this make no sense
            delete element.name;
        }

        export function getCommonStyle(mainStyle: StyleProperties, nextStyle: StyleProperties): StyleProperties {
            return { ...mainStyle, ...nextStyle };
        }

        /**
         * Method to rebuild your elementSet using params defined earlier in xml.
         * @param elementSet element set for window
         * @returns UI.ElementSet
         */

        export function rebuildElementSet(elementSet: Elements | UI.ElementSet): UI.ElementSet {
            let dataID = {};

            for(const key in elementSet) {
                const element = elementSet[key] as Element;
        
                if(!element || typeof element !== "object") {
                    continue;
                }
                element.id = element.id || "default";
        
                const marginHeight = Number(element.marginBottom || 0) - Number(element.marginTop || 0);
                const marginWidth = Number(element.marginRight || 0) - Number(element.marginLeft || 0);
                const data = dataID[element.id] = dataID[element.id] || { x: 0, y: 0 };
                
                const bitmap = null//TextureSource.getNullable(String(element.bitmap));
                const scale = element.scale || (element.font && element.font.size) || 1;
                const width = element.width || (bitmap && bitmap.getWidth() * scale) || ((element.multiline) ? Math.max(...element.text.split('\n').map(v => v.length * scale)) : (element.text ? element.text.length : 0) * scale);
                const height = element.height || (bitmap && bitmap.getHeight() * scale) || 0;
        
                data.x += marginWidth + width;
                data.y += marginHeight + height;

                element.x = (Number(element.x) || 0) + data.x;
                element.y = (Number(element.y) || 0) + data.y;
        
                deleteGarbage(element);
            }
            return elementSet;
        }

        export function getElementSetFrom(children: Elements[], style?: StyleProperties) {
            let elementSet: UI.ElementSet = {};

            for(const i in children) {
                const element = children[i];
                //parseElement();
                if(style != null) {
                    setDefaultsForElement(element as Element, style);
                }
                Object.assign(elementSet, element);
            }
            return elementSet;
        }

        export interface StyleProperties {
            marginTop?: number;
            marginBottom?: number;
            marginLeft?: number;
            marginRight?: number
            width?: number;
            height?: number;
        }

        export interface DivProperties {
            id: string;
            style: string | StyleProperties;
            className: string
        }

        export function setDefaultsForElement(element: Element, style: StyleProperties): void {
            Object.assign(element, style, element);
        }

        export function getElementSetWithDiv(properties: DivProperties, children?: Elements[]): UI.ElementSet {
            const commonStyle: StyleProperties = typeof properties.style != "object" ? parseStyleFromString(properties.style) : properties.style as StyleProperties;
            const elements = {};
            for(const i in children) {
                if(i == "div") {
                    const style = getCommonStyle(commonStyle, children[i].style);
                    //Object.assign(elements, getElementSetFrom(chil))
                } 
            }
            return elements;
        }

        export function parseStyleFromString(style: string): StyleProperties {
            throw new java.lang.UnsupportedOperationException("Not implemented");
        }

        export function Fragment(properties: ElementProperties, ...children: (Elements | Record<string, Elements>)[]): UI.ElementSet {
            return rebuildElementSet(getElementSetFrom(children as Elements[]));
        }

        export function getStyleParamsFromDiv(properties: DivProperties): Nullable<StyleProperties> {
            if(properties.className != null) {
                return divClasses[properties.className];
            }
            if(typeof properties.style == "string") {
                return parseStyleFromString(properties.style);
            }
            return properties.style;
        }
    }
}

// DEBUG:
// const window = (
//     <window x="500" forceScrollY={true} onOpen={(window)=>console.log("aboba")}>
//         <elements> 
//             <text name="aboba" marginBottom="25">Hi world!</text>
//             <text name="aboba2" marginBottom="10" text="abobalolpicture"/>
//         </elements>
//         {/* <drawing>
//             <text>abo</text>
//             <line>ba</line>
//             <line>ba</line>
//             <line>ba</line>
//         </drawing> */}
//     </window>
// );
// const Component = () => 
//     <>
//         <text name="debug"> howdy! </text>
//     </>

// declare namespace console {
//     export function log(string);
// }
// console.log(JSON.stringify(window) + "\n\n" + JSON.stringify(Component()))
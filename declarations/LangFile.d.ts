interface ILangSettings {
    /**
     * Language
     */
    lang?: string;
    /**
     * Concats lines with \n, if you use multiline format of value
     */
    concatMultiline?: boolean;
    /**
     * Enables more of performances. If it's false, it will parse faster, but considerings only inline comments.
     @default false
     */
    parseAdvanced?: boolean;
    /**
     * Format of comments
     */
    commentFormat?: {
        /**
         * @default #
         */
        inline?: string;
        /**
         * @default #->
         */
        start?: string;
        /**
         * @default <-#
         */
        end?: string;
    };
    /**
     * Char to embed multiline
     * @default `
     */
    multilineChar?: string;
    /**
     * Char to embed keywords
     */
    keywordEmbedding?: {
        /**
         * @default ${
         */
        start: string;
        /**
         * @default }
         */
        end: string;
    };
}
/**
 * Class to read, manipulate and register translations from .lang files in defined format from library.
 * @example
   ```lang
   //lang file start
   rocketTier: 1 tier //register keyword
   mod.rocket = I am rocket from mod and my tier is ${rocketTier} //register translation, keyword inside line
 
   mod.version := 1.0.0 //register translation and keyword
   mod.info = I am mod, adds ${rocketTier} rocket and my version is ${version}
   //lang file end
   ```
   ```javascript
   //in mod
   const langFile = new LangFile("path/to/file.lang", {
        lang: "en",
        parseAdvanced: true
   });
   Game.message(JSON.stringify(langFile.keywords));
   //{
   //"rocketTier": "1 tier",
   //"version": "1.0.0"
   //}
   Game.message(JSON.stringify(langFile.entries));
   //{
   //"mod.rocket": "I am rocket from mod and my tier is 1 tier",
   //"mod.version": "I am mod, adds 1 tier rocket and my version is 1.0.0"
   //}
   langFile.registerTranslations();
   alert(Translation.translate("mod.rocket")) // I am rocket from mod and my tier is 1 tier
   ```
 */
declare class LangFile {
    path: string;
    /**
     * List of supports languages
     */
    static readonly langs: string[];
    /**
     * String from file
     */
    readonly file: string;
    /**
     * Settings to parse
     */
    settings: ILangSettings;
    /**
     * Entries in {[key: string]: string} format
     */
    entries: Record<string, string>;
    /**
     * Keywords in {[key: string]: string} format
     */
    keywords: Record<string, string>;
    /**
     * @param path file path
     * @param settings parse settings
     */
    constructor(path: string, settings: ILangSettings);
    /**
     * Method to get entry [key, value] without comments.
     * @param line line
     * @param separator separator between key and value
     */
    protected getEntry(line: string, separator: string): string[];
    /**
     * Method to default parse file.
     */
    protected parse(): void;
    /**
     * Method to advanced parse file.
     */
    protected parseAdvanced(): void;
    /**
     * Method to register translations.
     */
    registerTranslations(): void;
    /**
     * Method to register translations from file.
     * @param path path
     * @param settings parse settings
     */
    static registerTranslationsFrom(path: string, settings?: ILangSettings): LangFile;
}

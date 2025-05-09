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
   const langFile = new LangFile("path/to/file.lang", "en", "//");
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
    /**
     * List of supports languages
     */
    static readonly langs: string[];
    /**
     * Language
     */
    readonly lang: string;
    /**
     * String from file
     */
    readonly file: string;
    /**
     * Comment format
     * @default //
     */
    commentFormat: string;
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
     * @param lang file language
     * @param commentFormat comment format
     */
    constructor(path: string, lang?: string, commentFormat?: string);
    /**
     * Method to get entries without comments
     * @param line line
     * @param separator separator between key and value
     */
    protected getEntry(line: string, separator: string): string[];
    /**
     * Parse file
     */
    protected parse(): void;
    /**
     * Register translations
     */
    registerTranslations(): void;
    static registerTranslationsFrom(path: string, lang: string, commentFormat?: string): LangFile;
}

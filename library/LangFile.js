LIBRARY({
    name: "LangFile",
    api: "CoreEngine",
    version: 1,
    shared: false
});
/**
 * Библиотека открыта для всех желающих создавать переводы при помощи отдельных файлов с удобным синтаксисом, поддерживающим комментарии, переменные и встраивания неограниченного количества переменных в строку.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
var LangFile = /** @class */ (function () {
    /**
     * @param path file path
     * @param lang file language
     * @param commentFormat comment format
     */
    function LangFile(path, lang, commentFormat) {
        if (lang === void 0) { lang = "en"; }
        /**
         * Entries in {[key: string]: string} format
         */
        this.entries = {};
        /**
         * Keywords in {[key: string]: string} format
         */
        this.keywords = {};
        if (!LangFile.langs.includes(lang)) {
            throw new Error("Wrong language format");
        }
        var file = FileTools.ReadText(path);
        if (file == null) {
            throw new Error("File from path \"".concat(path, "\" is not found"));
        }
        this.lang = lang;
        this.commentFormat = commentFormat || "//";
        this.file = file;
        this.parse();
    }
    /**
     * Method to get entries without comments
     * @param line line
     * @param separator separator between key and value
     */
    LangFile.prototype.getEntry = function (line, separator) {
        var _this = this;
        return line.split(separator).map(function (v) { return v.split(_this.commentFormat)[0].trim(); });
    };
    /**
     * Parse file
     */
    LangFile.prototype.parse = function () {
        var entries = {};
        var keywords = {};
        var splited = this.file.split("\n");
        for (var i in splited) {
            var line = splited[i].trim();
            if (line.length == 0) {
                continue;
            }
            if (line.startsWith(this.commentFormat)) {
                continue;
            }
            if (!line.includes("=") && line.includes(":")) {
                var _a = __read(this.getEntry(line, ":"), 2), key_1 = _a[0], value_1 = _a[1];
                keywords[key_1] = value_1;
                continue;
            }
            if (line.includes(":=")) {
                var _b = __read(this.getEntry(line, ":="), 2), key_2 = _b[0], value_2 = _b[1];
                keywords[key_2] = value_2;
                entries[key_2] = value_2;
                continue;
            }
            if (!line.includes("=")) {
                continue;
            }
            var _c = __read(this.getEntry(line, "="), 2), key = _c[0], value = _c[1];
            if (value.includes("${")) {
                var index = 0;
                while (index < value.length) {
                    var lastStart = value.indexOf("${", index);
                    if (lastStart == -1) {
                        break;
                    }
                    var lastEnd = value.indexOf("}", lastStart);
                    if (lastEnd == -1) {
                        throw new Error("Wrong construction ${ [keyword] }");
                    }
                    var keyName = value.slice(lastStart + 2, lastEnd);
                    var replacement = keywords[keyName];
                    if (replacement != undefined) {
                        value = value.slice(0, lastStart) + replacement + value.slice(lastEnd + 1);
                    }
                    index = lastStart + replacement.length || 0;
                }
            }
            entries[key] = value;
        }
        this.entries = entries;
        this.keywords = keywords;
    };
    /**
     * Register translations
     */
    LangFile.prototype.registerTranslations = function () {
        var _a;
        for (var key in this.entries) {
            Translation.addTranslation(key, (_a = {},
                _a[this.lang] = this.entries[key],
                _a));
        }
    };
    LangFile.registerTranslationsFrom = function (path, lang, commentFormat) {
        var file = new LangFile(path, lang, commentFormat);
        file.registerTranslations();
        return file;
    };
    /**
     * List of supports languages
     */
    LangFile.langs = ["ru", "en", "uk", "kz"];
    return LangFile;
}());
EXPORT("LangFile", LangFile);

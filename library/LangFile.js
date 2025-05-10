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
var LangFile = /** @class */ (function () {
    /**
     * @param path file path
     * @param settings parse settings
     */
    function LangFile(path, settings) {
        this.path = path;
        /**
         * Entries in {[key: string]: string} format
         */
        this.entries = {};
        /**
         * Keywords in {[key: string]: string} format
         */
        this.keywords = {};
        settings = settings || {};
        if (!LangFile.langs.includes(settings.lang)) {
            throw new Error("Wrong language \"".concat(settings.lang, "\" format"));
        }
        var file = FileTools.ReadText(path);
        if (file == null) {
            throw new Error("File from path \"".concat(path, "\" is not found"));
        }
        settings.parseAdvanced = settings.parseAdvanced || true;
        settings.commentFormat = settings.commentFormat || {};
        settings.commentFormat.inline = settings.commentFormat.inline || "#";
        settings.commentFormat.start = settings.commentFormat.start || "<-#";
        settings.commentFormat.end = settings.commentFormat.end || "#->";
        settings.keywordEmbedding = settings.keywordEmbedding || {
            start: "${",
            end: "}"
        };
        settings.multilineChar = settings.multilineChar || "`";
        this.file = file;
        if (settings.parseAdvanced == true) {
            this.parseAdvanced();
        }
        else {
            this.parse();
        }
    }
    /**
     * Method to get entry [key, value] without comments.
     * @param line line
     * @param separator separator between key and value
     */
    LangFile.prototype.getEntry = function (line, separator) {
        var _this = this;
        return line.split(separator).map(function (v) { return v.split(_this.settings.commentFormat.inline)[0].trim(); });
    };
    /**
     * Method to default parse file.
     */
    LangFile.prototype.parse = function () {
        var entries = {};
        var splited = this.file.split("\n");
        for (var i in splited) {
            var line = splited[i].trim();
            var _a = __read(this.getEntry(line, "="), 2), key = _a[0], value = _a[1];
            if (line.length == 0 || line.startsWith(this.settings.commentFormat.inline)) {
                continue;
            }
            entries[key] = value;
        }
    };
    /**
     * Method to advanced parse file.
     */
    LangFile.prototype.parseAdvanced = function () {
        var entries = {};
        var keywords = {};
        var splited = this.file.split("\n");
        var commentIndex = null;
        var longString = null;
        for (var i in splited) {
            var line = splited[i];
            if (line.startsWith(this.settings.commentFormat.inline)) {
                continue;
            }
            if (longString == null) {
                line = line.trim();
                if (line.length == 0) {
                    continue;
                }
                var stringSymbol = line.indexOf(this.settings.multilineChar);
                if (stringSymbol != -1) {
                    longString = line;
                    continue;
                }
            }
            if (longString != null) {
                var stringSymbol = line.indexOf(this.settings.multilineChar);
                if (stringSymbol != -1) {
                    longString += line.slice(longString);
                    line = longString.replaceAll(this.settings.multilineChar, "");
                    longString = null;
                }
                else {
                    longString += line + this.settings.concatMultiline ? "\n" : "";
                    continue;
                }
            }
            if (commentIndex != null) {
                var commentEnd = line.indexOf(this.settings.commentFormat.end);
                if (commentEnd == -1) {
                    continue;
                }
                line = line.slice(commentEnd + this.settings.commentFormat.end.length);
                commentIndex = null;
            }
            if (!line.includes("=") && line.includes(":")) {
                var _a = __read(this.getEntry(line, ":"), 2), key_1 = _a[0], value_1 = _a[1];
                keywords[key_1] = value_1;
                continue;
            }
            var commentStart = line.indexOf(this.settings.commentFormat.start);
            if (commentIndex == null && commentStart != -1) {
                line = line.slice(0, commentStart);
                commentIndex = i;
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
            if (!value) {
                throw new Error("Wrong value from key: \"".concat(key, "\""));
            }
            if (value.includes(this.settings.keywordEmbedding.start)) {
                var index = 0;
                while (index < value.length) {
                    var lastStart = value.indexOf(this.settings.keywordEmbedding.start, index);
                    if (lastStart == -1) {
                        break;
                    }
                    var lastEnd = value.indexOf(this.settings.keywordEmbedding.end, lastStart);
                    if (lastEnd == -1) {
                        throw new Error("Wrong construction ".concat(this.settings.keywordEmbedding.start, " [keyword] ").concat(this.settings.keywordEmbedding.end));
                    }
                    var keyName = value.slice(lastStart + (this.settings.keywordEmbedding.start.length), lastEnd);
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
     * Method to register translations.
     */
    LangFile.prototype.registerTranslations = function () {
        var _a;
        for (var key in this.entries) {
            Translation.addTranslation(key, (_a = {},
                _a[this.settings.lang] = this.entries[key],
                _a));
        }
    };
    /**
     * Method to register translations from file.
     * @param path path
     * @param settings parse settings
     */
    LangFile.registerTranslationsFrom = function (path, settings) {
        var file = new LangFile(path, settings);
        file.registerTranslations();
        return file;
    };
    /**
     * List of supports languages
     */
    LangFile.langs = ["ru", "en", "uk", "kz"];
    return LangFile;
}());
/*
const file = "" +
"aboba:= абоба" + "\n" +
"hi = `привет " + "\n"  + " ${aboba} " + "и не только`//hehe" + "\n" +
"as = 1" + "and heh";
*/ 
EXPORT("LangFile", LangFile);

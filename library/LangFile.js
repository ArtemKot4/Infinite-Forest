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
        settings = settings || {};
        if (!LangFile.langs.includes(settings.lang)) {
            throw new Error("Wrong language \"".concat(settings.lang, "\" format"));
        }
        var file = FileTools.ReadText(path);
        if (file == null) {
            throw new Error("File from path \"".concat(path, "\" is not found"));
        }
        this.entries = {};
        settings.parseAdvanced = settings.parseAdvanced || true;
        settings.commentFormat = settings.commentFormat || {};
        settings.commentFormat.inline = settings.commentFormat.inline || "#";
        this.file = file;
        if (settings.parseAdvanced == true) {
            this.keywords = {};
            settings.commentFormat.start = settings.commentFormat.start || "<-#";
            settings.commentFormat.end = settings.commentFormat.end || "#->";
            settings.keywordEmbedding = settings.keywordEmbedding || {
                start: "${",
                end: "}"
            };
            settings.concatMultiline = settings.concatMultiline || true;
            settings.multilineChar = settings.multilineChar || "`";
            this.settings = settings;
            this.parseAdvanced();
        }
        else {
            this.settings = settings;
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
        var entry = line.split(separator).map(function (v) { return v.split(_this.settings.commentFormat.inline)[0].trim(); });
        var index = entry.findIndex(function (v) { return !v; });
        if (index != -1) {
            throw new Error("Not valid format of ".concat(index == 0 ? "key" : "value", " at line \"").concat(line, "\""));
        }
        return entry;
    };
    /**
     * Method to default parse file.
     */
    LangFile.prototype.parse = function () {
        var lines = this.file.split("\n");
        for (var i in lines) {
            var line = lines[i].trim();
            var _a = __read(this.getEntry(line, "="), 2), key = _a[0], value = _a[1];
            if (line.length == 0 || line.startsWith(this.settings.commentFormat.inline)) {
                continue;
            }
            this.entries[key] = value;
        }
    };
    /**
     * Method to advanced parse file.
     */
    LangFile.prototype.parseAdvanced = function () {
        var _a;
        var lines = this.file.split("\n");
        var commentIndex = null;
        var longString = null;
        for (var i in lines) {
            var line = lines[i];
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
                    longString = line + (this.settings.concatMultiline ? "\n" : "");
                    continue;
                }
            }
            if (longString != null) {
                var stringSymbol = line.indexOf(this.settings.multilineChar);
                if (stringSymbol != -1) {
                    longString += line.substring(longString);
                    line = longString.replace(new RegExp(this.settings.multilineChar, "g"), "");
                    longString = null;
                }
                else {
                    longString += line + (this.settings.concatMultiline ? "\n" : "");
                    continue;
                }
            }
            if (commentIndex != null) {
                var commentEnd = line.indexOf(this.settings.commentFormat.end);
                if (commentEnd == -1) {
                    continue;
                }
                line = line.substring(commentEnd + this.settings.commentFormat.end.length);
                commentIndex = null;
            }
            if (!line.includes("=") && line.includes(":")) {
                var _b = __read(this.getEntry(line, ":"), 2), key_1 = _b[0], value_1 = _b[1];
                this.keywords[key_1] = value_1;
                continue;
            }
            var commentStart = line.indexOf(this.settings.commentFormat.start);
            if (commentIndex == null && commentStart != -1) {
                line = line.substring(0, commentStart);
                commentIndex = i;
            }
            if (line.includes(":=")) {
                var _c = __read(this.getEntry(line, ":="), 2), key_2 = _c[0], value_2 = _c[1];
                this.keywords[key_2] = value_2;
                this.entries[key_2] = value_2;
                continue;
            }
            if (!line.includes("=")) {
                continue;
            }
            var _d = __read(this.getEntry(line, "="), 2), key = _d[0], value = _d[1];
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
                    var keyName = value.substring(lastStart + (this.settings.keywordEmbedding.start.length), lastEnd);
                    var keyValue = this.keywords[keyName];
                    if (keyValue != undefined) {
                        value = value.substring(0, lastStart) + keyValue + value.substring(lastEnd + this.settings.keywordEmbedding.end.length);
                    }
                    index = (_a = lastStart + (keyValue === null || keyValue === void 0 ? void 0 : keyValue.length)) !== null && _a !== void 0 ? _a : 0;
                }
            }
            this.entries[key] = value;
        }
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
    LangFile.langs = ["ru", "en", "uk", "kz", "es", "pt", "zh"];
    return LangFile;
}());
/*
const file = "" +
    "aboba:= абоба" + "\n" +
    "hi = `привет " + "\n"  + " ${aboba} " + "и не только`//hehe" + "\n" +
    "as = 1" + "and heh";
*/ 
EXPORT("LangFile", LangFile);

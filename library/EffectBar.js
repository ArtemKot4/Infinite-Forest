LIBRARY({
    name: "EffectBar",
    api: "CoreEngine",
    version: 1,
    shared: true
});
/**
 * Библиотека открыта для всех желающих создать уникальные эффекты с использованием интерфейсов. Поддерживает анимацию и готова помочь реализовать любые ваши идеи!
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
Translation.addTranslation("message.effectbar.successfully_set", {
    en: "Effect %s successfully set",
    ru: "Эффект %s успешно установлен"
});
Translation.addTranslation("message.effectbar.successfully_remove", {
    en: "Effect %s successfully cleared",
    ru: "Эффект %s успешно очищен"
});
Translation.addTranslation("message.effectbar.not_allowed", {
    en: "Not allowed",
    ru: "Нет доступа"
});
Translation.addTranslation("message.effectbar.not_exists_effect", {
    en: "Effect %s not exists",
    ru: "Эффект %s не существует"
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Class of effect hud.
 */
var EffectHud = /** @class */ (function () {
    /**
     * @param type effect type
     */
    function EffectHud(type) {
        this.type = type;
        /**
         * Lock state.
         */
        this.lock = false;
        /**
         * UI of hud. Opening without {@link open} opens empty white ui.
         */
        this.UI = (function () {
            var window = new UI.Window();
            window.setAsGameOverlay(true);
            window.setTouchable(false);
            return window;
        })();
    }
    ;
    /**
     * Method, defines sleep time to thread.
     */
    EffectHud.prototype.getThreadSleepTime = function () {
        return 50;
    };
    /**
     * Method, defines spacing between hud. Usings by formula: ({@link getLocation getLocation().y } + {@link getSpacing getSpacing()} * index).
     */
    EffectHud.prototype.getSpacing = function () {
        return 50;
    };
    /**
     * Method, defines hud's background color.
     * @default android.graphics.Color.TRANSPARENT
     */
    EffectHud.prototype.getBackgroundColor = function () {
        return android.graphics.Color.TRANSPARENT;
    };
    /**
     * Method, builds and returns hud's window content by defined methods.
     */
    EffectHud.prototype.getContent = function () {
        var elements = this.getElements();
        var location = this.getLocation();
        if (!location) {
            throw new java.lang.RuntimeException("Location of effect hud by type: \"".concat(this.type, "\" is not defined"));
        }
        if (!elements) {
            throw new java.lang.RuntimeException("Elements of effect hud by type: \"".concat(this.type, "\" is not defined"));
        }
        location.y += this.getSpacing() * EffectHud.positions.size;
        var content = {
            location: __assign(__assign({}, location), { y: 0 }),
            drawing: [
                {
                    type: "background",
                    color: this.getBackgroundColor()
                }
            ],
            elements: {}
        };
        for (var i in elements) {
            elements[i].y = location.y + (elements[i].y || 0);
        }
        content.elements = elements;
        return content;
    };
    ;
    /**
     * Method to get opened state of window.
     */
    EffectHud.prototype.isOpened = function () {
        return this.UI.isOpened();
    };
    /**
     * Method, opens ui with builded content and increases {@link positions} size.
     */
    EffectHud.prototype.open = function () {
        if (this.isOpened())
            return;
        EffectHud.increaseCount();
        var content = this.getContent();
        this.index = EffectHud.positions.size;
        this.height = this.getLocation().y + this.getSpacing() * this.index;
        this.UI.setContent(content);
        this.UI.forceRefresh();
        this.UI.open();
        return;
    };
    /**
     * Method, closes ui and decreases {@link positions} size by delete {@link index} value.
     */
    EffectHud.prototype.close = function () {
        this.lock = false;
        this.UI.close();
        EffectHud.decreaseCountBy(this.index);
    };
    /**
     * Method set scale of hud.
     * @param scale scale name
     * @param value value
     * @param max max value
     */
    EffectHud.prototype.setScale = function (scale, value, max) {
        this.UI.getElements().get(scale).setBinding("value", value / max);
        return;
    };
    /**
     * Method sets hud alpha to 0 and clears scale filling.
     */
    EffectHud.prototype.clear = function () {
        this.setScale("scale", 0, 0);
        if (this.isOpened()) {
            this.UI.layout.setAlpha(0);
        }
    };
    /**
     * Method, defines condition to prevent init hud.
     * @param playerUid number
     * @returns condition
     */
    EffectHud.prototype.preventInit = function (playerUid) {
        return this.lock == true;
    };
    /**
     * Method, calls when initialization was prevented.
     * @param playerUid player unique identifier
     */
    EffectHud.prototype.onPreventInit = function (playerUid) { };
    ;
    /**
     * Method, calls when hud was closed.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    EffectHud.prototype.onClose = function (playerUid, effectData) { };
    ;
    /**
     * Method, calls when hud full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    EffectHud.prototype.onFull = function (playerUid, effectData) { };
    ;
    /**
     * Method, inits hud.
     * @param playerUid player unique identifier
     */
    EffectHud.prototype.init = function (playerUid) {
        var _this = this;
        if (this.preventInit(playerUid)) {
            return this.onPreventInit(playerUid);
        }
        if ("onInit" in this) {
            this.onInit(playerUid);
        }
        this.open();
        this.clear();
        this.thread = Threading.initThread("thread.effectbar.ui", function () { return _this.run(playerUid); });
    };
    /**
     * Method, sets height of hud elements.
     * @param height height
     */
    EffectHud.prototype.setHeight = function (height) {
        var contentElements = this.getElements();
        var uiElements = this.UI.getElements();
        for (var i in contentElements) {
            var element = uiElements.get(i);
            element.setPosition(element.x, height + (contentElements[i].y || 0));
        }
        return;
    };
    /**
     * Method, checks is valid height for hud with specified index.
     * @param index number
     * @returns condition
     */
    EffectHud.prototype.isValidHeightFor = function (index) {
        return this.height <= this.getLocation().y + (this.getSpacing() * index);
    };
    /**
     * Method, realizes animation of replace positions.
     * @param playerUid player unique identifier
     */
    EffectHud.prototype.animate = function (playerUid) {
        if (this.index > 1 && EffectHud.positions.has(this.index - 1) == false) {
            if (!this.isValidHeightFor(this.index - 1)) { //this.isValidHeightFor(this.index - 1) == false) {
                this.setHeight(this.height -= 2);
            }
            else {
                EffectHud.decreaseCountBy(this.index);
                this.index--;
                EffectHud.positions.add(this.index);
            }
        }
        return;
    };
    /**
     * Method, works in thread of hud.
     * @param playerUid player unique identifier
     */
    EffectHud.prototype.run = function (playerUid) {
        var threadSleepTime = this.getThreadSleepTime();
        while (true) {
            java.lang.Thread.sleep(threadSleepTime);
            if (!this.isOpened()) {
                continue;
            }
            var effectData = Effect.getFor(playerUid, this.type);
            this.animate(playerUid);
            this.setScale("scale", effectData.progress, effectData.progressMax);
            if ("onThread" in this) {
                this.onThread(playerUid, effectData);
            }
            if (effectData.progress >= effectData.progressMax) {
                this.onFull(playerUid, effectData);
            }
            var alpha = this.UI.layout.getAlpha();
            if (effectData.timer > 0) {
                if (alpha < 1) {
                    if ("onAppear" in this) {
                        this.onAppear(playerUid, effectData);
                    }
                    this.UI.layout.setAlpha(alpha + 0.05);
                }
            }
            if (effectData.timer <= 0 && effectData.progress <= 0) {
                if (alpha > 0) {
                    if ("onDisappear" in this) {
                        this.onDisappear(playerUid, effectData);
                    }
                    this.UI.layout.setAlpha(alpha - 0.05);
                }
                else {
                    this.close();
                    this.onClose(playerUid, effectData);
                    return;
                }
            }
        }
        return;
    };
    /**
     * Method, increases {@link positions} size.
     */
    EffectHud.increaseCount = function () {
        EffectHud.positions.add(EffectHud.positions.size + 1);
    };
    /**
     * Method, decreases {@link positions} size with delete value by specified index.
     * @param index number
     */
    EffectHud.decreaseCountBy = function (index) {
        EffectHud.positions.delete(index);
    };
    /**
     * Set of positions opened huds. Need to work animation of replace positions.
     */
    EffectHud.positions = new Set();
    return EffectHud;
}());
Callback.addCallback("NativeGuiChanged", function (screenName) {
    for (var effectType in Effect.list) {
        var hud = Effect.get(effectType).hud;
        var effect = Effect.getFor(Player.getLocal(), effectType);
        if ((screenName === "in_game_play_screen" || screenName === "death_screen") && (effect.lock == true && !hud.isOpened())) {
            hud.open();
        }
        else {
            hud.close();
        }
    }
});
/**
 * Class to create your custom effects.
 */
var Effect = /** @class */ (function () {
    /**
     * @param prototype Prototype of your effect. Use if you don't use your extended {@link Effect} class.
     */
    function Effect(prototype) {
        this.hud = this.getHud();
        if (!prototype) {
            return;
        }
        var type = prototype.getType();
        if (!type) {
            throw new java.lang.RuntimeException("Prototype of Effect must have a getType() function");
        }
        if ("getHud" in prototype) {
            this.getHud = prototype.getHud;
            this.hud = prototype.getHud();
        }
        if ("onFull" in prototype) {
            this.onFull = prototype.onFull;
        }
        if ("onIncrease" in prototype) {
            this.onIncrease = prototype.onIncrease;
        }
        if ("onDecrease" in prototype) {
            this.onDecrease = prototype.onDecrease;
        }
        if ("onInit" in prototype) {
            this.onInit = prototype.onInit;
        }
        if ("onEnd" in prototype) {
            this.onEnd = prototype.onEnd;
        }
        if ("init" in prototype) {
            this.init = prototype.init;
        }
    }
    /**
     * Method to get your effect type. Must be defined.
     */
    Effect.prototype.getType = function () {
        return null;
    };
    /**
     * Method to set field {@link hud} value. Must be defined.
     */
    Effect.prototype.getHud = function () {
        return null;
    };
    /**
     * Method, calls when your scale effect is full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    Effect.prototype.onFull = function (playerUid, effectData) { };
    ;
    /**
     * Method, calls when your scale effect is increasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    Effect.prototype.onIncrease = function (playerUid, effectData) { };
    ;
    /**
     * Method, calls when your scale effect is decreasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */
    Effect.prototype.onDecrease = function (playerUid, effectData) { };
    ;
    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     */
    Effect.prototype.initFor = function (playerUid) {
        var client = Network.getClientForPlayer(playerUid);
        if (client) {
            client.send("packet.effectbar.scale_open", {
                effectType: this.getType()
            });
        }
    };
    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     * @param progressMax progress max
     * @param timerMax timer max
     */
    Effect.prototype.init = function (playerUid, progressMax, timerMax) {
        timerMax = timerMax || this.timerMax || 5;
        var type = this.getType();
        Effect.setFor(playerUid, type, {
            timer: timerMax
        });
        if (Effect.getFor(playerUid, type).lock == true) {
            return;
        }
        progressMax = progressMax ? Math.ceil(progressMax) : this.progressMax;
        Callback.invokeCallback("EffectInit", playerUid, progressMax, timerMax);
        Effect.setFor(playerUid, type, {
            lock: true,
            timerMax: timerMax,
            progress: 0,
            progressMax: progressMax
        });
        this.initFor(playerUid);
        if ("onInit" in this) {
            this.onInit(playerUid, Effect.getFor(playerUid, type));
        }
        var self = this;
        Updatable.addUpdatable({
            update: function () {
                var time = World.getThreadTime();
                var effectData = Effect.getFor(playerUid, type);
                if (time % 20 === 0 && effectData.timer > 0) {
                    effectData.timer -= 1;
                }
                if (effectData.timer > 0 && effectData.progress <= progressMax) {
                    effectData.progress += 1;
                    self.onIncrease(playerUid, effectData);
                }
                if (effectData.timer <= Math.floor(timerMax / 2) && effectData.progress > 0) {
                    self.onDecrease(playerUid, effectData);
                    effectData.progress -= 1;
                }
                if (effectData.progress >= progressMax) {
                    self.onFull(playerUid, effectData);
                }
                if (time % 60 === 0 && effectData.timer <= 0 && effectData.progress <= 0) {
                    if ("onEnd" in this) {
                        self.onEnd(playerUid, effectData);
                    }
                    effectData.lock = false;
                    this.remove = true;
                }
                Effect.sendFor(playerUid, type, effectData);
            }
        });
        return;
    };
    /**
     * Method to register your effect in {@link list}
     * @param effect your effect or prototype
     */
    Effect.register = function (effect) {
        var object = effect instanceof Effect ? effect : new Effect(effect);
        return Effect.list[object.getType()] = object;
    };
    /**
     * Method to get your effect by type;
     */
    Effect.get = function (effectType) {
        return Effect.list[effectType] || null;
    };
    /**
     * Method to get effect data for specified player
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */
    Effect.getFor = function (playerUid, effectType) {
        var _a;
        var _b;
        var player = Effect.players[playerUid];
        if (player) {
            return (_a = (_b = Effect.players[playerUid])[effectType]) !== null && _a !== void 0 ? _a : (_b[effectType] = Effect.getEmptyData());
        }
        return null;
    };
    /**
     * Method to update effect data about player on client side;
     * @param effectType type of effect;
     * @param effectData effect data of player. All is optional, e.g. it is assigning new data with previous data
     */
    Effect.sendFor = function (playerUid, effectType, effectData) {
        var client = Network.getClientForPlayer(playerUid);
        if (client) {
            client.send("packet.effectbar.data_sync_for_client", {
                effectType: effectType,
                playerUid: playerUid,
                effectData: effectData
            });
        }
        return;
    };
    /**
     * Method to set effect data for specified player, if player exists in data.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     * @param effectData effect data of player
     */
    Effect.setFor = function (playerUid, effectType, effectData) {
        var _a;
        var _b;
        var player = (_a = (_b = Effect.players)[playerUid]) !== null && _a !== void 0 ? _a : (_b[playerUid] = {});
        var previousData = player[effectType] || Effect.getEmptyData();
        player[effectType] = Object.assign(previousData, effectData);
    };
    /**
     * Method to clear effect data for specified player by server and client side.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */
    Effect.clearFor = function (playerUid, effectType) {
        Effect.setFor(playerUid, effectType, Effect.getEmptyData());
        Effect.sendFor(playerUid, effectType, Effect.getEmptyData());
    };
    /**
     * Method to get empty data for effects. Use if {@link clearFor} method don't satisfies your needs
     */
    Effect.getEmptyData = function () { return ({
        lock: false,
        progress: 0,
        progressMax: 100,
        timer: 0
    }); };
    /**
     * Object of all players with all their effects
     */
    Effect.players = {};
    /**
     * List of all effects
     */
    Effect.list = {};
    return Effect;
}());
Callback.addCallback("EntityDeath", function (entity) {
    if (Entity.getType(entity) === EEntityType.PLAYER) {
        for (var effectType in Effect.list) {
            Effect.clearFor(entity, effectType);
        }
    }
});
Callback.addCallback("ServerPlayerLoaded", function (playerUid) {
    Effect.players = Effect.players || {};
    Effect.players[playerUid] = Effect.players[playerUid] || {};
    for (var effectType in Effect.list) {
        var effectData = Effect.getFor(playerUid, effectType);
        Effect.sendFor(playerUid, effectType, effectData);
        if (effectData.lock === true && effectData.timer > 0 && effectData.progress > 0) {
            effectData.lock = false;
            Network.getClientForPlayer(playerUid).send("packet.effectbar.hud_unlock", { effectType: effectType });
            Effect.get(effectType).init(playerUid, effectData.progressMax, effectData.timerMax);
        }
    }
});
Callback.addCallback("LocalLevelLeft", function () {
    Effect.players = {};
});
Saver.addSavesScope("scope.effectbar", function read(scope) {
    scope = scope || Effect.players;
}, function save() {
    return Effect.players || {};
});
var Callback;
(function (Callback) {
    /**
     * Callback, calls when effect inits.
     * @param playerUid player unique identifier
     * @param progressMax max progress
     * @param timerMax max timer
     */
})(Callback || (Callback = {}));
Network.addClientPacket("packet.effectbar.data_sync_for_client", function (data) {
    Effect.players = Effect.players || {};
    Effect.players[data.playerUid] = Effect.players[data.playerUid] || {};
    return Effect.setFor(data.playerUid, data.effectType, data.effectData);
});
Network.addClientPacket("packet.effectbar.scale_open", function (data) {
    return Effect.get(data.effectType).hud.init(Player.getLocal());
});
Network.addClientPacket("packet.effectbar.hud_unlock", function (data) {
    Effect.get(data.effectType).hud.lock = false;
});
Callback.addCallback("NativeCommand", function (command) {
    if (command.startsWith("/effectbar")) {
        Game.prevent();
        return Network.sendToServer("packet.effectbar.command", {
            args: command.split(" ").slice(1)
        });
    }
});
Network.addServerPacket("packet.effectbar.command", function (client, data) {
    if (client == null)
        return;
    var playerUid = client.getPlayerUid();
    if (!new PlayerActor(playerUid).isOperator()) {
        client.sendMessage(Native.Color.RED + Translation.translate("message.effectbar.not_allowed"));
    }
    var arguments = {
        action: data.args[0],
        effectType: data.args[1],
        progressMax: data.args[2],
        timerMax: data.args[3]
    };
    var effect = Effect.get(data.args[1]);
    if (!new PlayerActor(playerUid).isOperator()) {
        return client.sendMessage(Native.Color.RED + Translation.translate("message.effectbar.not_allowed"));
    }
    switch (arguments.action) {
        case "set": {
            if (effect == null) {
                return client.sendMessage(Native.Color.RED + Translation.translate("message.effectbar.not_exists_effect").replace("%s", data.args[1]));
            }
            effect.init(playerUid, Number(arguments.progressMax) || effect.progressMax, Number(arguments.timerMax) || effect.timerMax);
            return client.sendMessage(Native.Color.GREEN + Translation.translate("message.effectbar.effect_successfully_set").replace("%s", data.args[1]));
        }
        case "clear": {
            if (!arguments.effectType) {
                for (var effectType in Effect.list) {
                    Effect.clearFor(playerUid, effectType);
                    client.sendMessage(Native.Color.GREEN + Translation.translate("message.effectbar.successfully_remove").replace("%s", effectType));
                }
                return;
            }
            Effect.clearFor(playerUid, arguments.effectType);
            client.sendMessage(Native.Color.GREEN + Translation.translate("message.effectbar.successfully_remove").replace("%s", arguments.effectType));
            return;
        }
    }
});
EXPORT("EffectHud", EffectHud);
EXPORT("Effect", Effect);

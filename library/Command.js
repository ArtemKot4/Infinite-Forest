LIBRARY({
    name: "Command",
    api: "CoreEngine",
    version: 1,
    shared: true
});
/**
 * Библиотека открыта для всех желающих удобно создавать команды.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
Translation.addTranslation("message.command.not_enough_arguments", {
    en: "Not enough arguments. You need %s arguments, but you gave %d",
    ru: "Недостаточно аргументов. Вам нужно %s аргументов, но вы предоставили %d",
});
Translation.addTranslation("message.command.invalid_boolean_type", {
    en: "Error! Invalid type of argument %s. It will be boolean (true/false)",
    ru: "Ошибка! Неправильный тип аргумента %s. Он должен быть типа boolean (true/false)"
});
Translation.addTranslation("message.command.invalid_number_type", {
    en: "Error! Invalid type of argument %s. It will be number",
    ru: "Ошибка! Неправильный тип аргумента %s. Он должен быть типа number"
});
Translation.addTranslation("message.command.invalid_search_entities", {
    en: "Error! Invalid search entities format. Use @s or @p or @a or @e",
    ru: "Ошибка! Неправильный запрос по сущностям. Используйте @s или @p или @a или @e"
});
Translation.addTranslation("message.command.list", {
    en: "List of all commands:",
    ru: "Список всех команд:"
});
var Command = /** @class */ (function () {
    function Command(caller, args, require_count) {
        this.caller = caller;
        this.arguments = args || {};
        this.require_count = typeof require_count === "number" ? require_count : Object.keys(this.arguments).length;
    }
    ;
    Command.prototype.getDescription = function () {
        return null;
    };
    Command.register = function (command) {
        Command.list[command.caller] = command;
    };
    Command.list = {};
    return Command;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Class to create your client side commands.
 */
var ClientCommand = /** @class */ (function (_super) {
    __extends(ClientCommand, _super);
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    function ClientCommand(caller, args, require_count) {
        return _super.call(this, caller, args, require_count) || this;
    }
    return ClientCommand;
}(Command));
/**
 * Class to create your server & client side commands
 */
var ServerCommand = /** @class */ (function (_super) {
    __extends(ServerCommand, _super);
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    function ServerCommand(caller, args, require_count) {
        var _this = _super.call(this, caller, args, require_count) || this;
        _this.buildPacket();
        return _this;
    }
    /**
     * Method, works on client. If you use it, you must send it packet from server.
     * @param data data from server
     * @returns void;
     */
    ServerCommand.prototype.onClient = function (data) {
        return null;
    };
    /**
     * Method to parse arguments: initiator -> @s, @p, @a, @e.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     * @returns
     */
    ServerCommand.prototype.getParsedData = function (client, data) {
        for (var i in data) {
            var argument_name = i;
            if (argument_name.startsWith("initiator")) {
                var value = data[argument_name];
                var obj = {
                    entities: [],
                    players: [],
                    caller: client.getPlayerUid()
                };
                if (typeof Number(value) !== "number") {
                    if (!value.startsWith("@") || !ServerCommand.initiator_chars.includes(value[1])) {
                        var error = Translation.translate("command.invalid_search_entities")
                            .replace("%s", argument_name);
                        client.sendMessage(Native.Color.RED + error);
                        continue;
                    }
                    switch (value.slice(0, 2)) {
                        case "@a": {
                            var players = Network.getConnectedPlayers();
                            for (var i_1 in players) {
                                obj.players.push(Number(players[i_1]));
                            }
                            break;
                        }
                        case "@e": {
                            var blockSource = BlockSource.getDefaultForActor(client.getPlayerUid());
                            var radius = Number(value.slice(3, -1).split("r=")[1]);
                            if (radius && radius > 0) {
                                var position = Entity.getPosition(client.getPlayerUid());
                                var radius_multipliered = radius * 2;
                                obj.entities = blockSource.listEntitiesInAABB(position.x - radius, position.y - radius, position.z - radius, position.x + radius_multipliered, position.y + radius_multipliered, position.z + radius_multipliered);
                            }
                            else {
                                obj.entities = Entity.getAll();
                            }
                        }
                    }
                }
                data[argument_name] = obj;
            }
        }
        return data;
    };
    /**
     * Method that create packets;
     */
    ServerCommand.prototype.buildPacket = function () {
        var _this = this;
        Network.addClientPacket("packet.command.client." + this.caller, this.onClient.bind(this));
        Network.addServerPacket("packet.command.server." + this.caller, function (client, data) { return _this.onServer(client, _this.getParsedData(client, data)); });
    };
    /**
     * Method to call client function. Sends packet to client.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     */
    ServerCommand.prototype.sendToClient = function (client, data) {
        if (client) {
            client.send("packet.command.client." + this.caller, data);
        }
    };
    /**
     * Method, sends message to client.
     * @param client just NetworkClient from server side
     * @param message any string message
     */
    ServerCommand.prototype.sendMessageToClient = function (client, message) {
        if (client) {
            client.sendMessage(Translation.translate(message));
        }
    };
    /**
     * Method to call client function with all valid players.
     * @param data your arguments from client
     */
    ServerCommand.prototype.sendToAllClients = function (data) {
        Network.sendToAllClients("packet.command.client." + this.caller, data);
    };
    ServerCommand.initiator_chars = ["s", "p", "a", "e"];
    return ServerCommand;
}(Command));
var ListCommand = /** @class */ (function (_super) {
    __extends(ListCommand, _super);
    function ListCommand() {
        return _super.call(this, "commandlist", {}) || this;
    }
    ListCommand.prototype.onCall = function (data) {
        var message = Translation.translate("message.command.list");
        var index = 1;
        for (var i in Command.list) {
            message += "\n";
            var current = Command.list[i];
            var description = (index + "." + " " + "/" + current.caller + " " + Object.entries(current.arguments).
                reduce(function (pv, cv) {
                pv += "<" + cv[0] + ":" + cv[1] + ">" + " ";
                return pv;
            }, "")
                .concat("—" + " " + (current.getDescription() || "...")));
            message += description;
            index++;
        }
        Game.message(message);
    };
    return ListCommand;
}(ClientCommand));
Command.register(new ListCommand());
Callback.addCallback("NativeCommand", function (command) {
    var splited = command.split(" ");
    var _loop_1 = function (i) {
        var current = Command.list[i];
        if ("/" + current.caller === splited[0]) {
            var args = splited.splice(1);
            if (current.require_count <= 0 || args.length >= current.require_count) {
                Game.prevent();
                var arguments_name_1 = Object.keys(current.arguments);
                var arguments_type_1 = Object.values(current.arguments);
                var arguments_1 = args.slice(0, Math.min(args.length, arguments_name_1.length))
                    .reduce(function (result, currentValue, currentIndex) {
                    var res = currentValue;
                    switch (arguments_type_1[currentIndex]) {
                        case "boolean":
                            {
                                if (currentValue === "true") {
                                    res = true;
                                }
                                else if (currentValue === "false") {
                                    res = false;
                                }
                                else {
                                    var error = Translation.translate("message.command.invalid_boolean_type")
                                        .replace("%s", arguments_name_1[currentIndex]);
                                    Game.message(Native.Color.RED + error);
                                    return;
                                }
                                ;
                                break;
                            }
                            ;
                        case "string":
                            {
                                res = currentValue;
                                break;
                            }
                            ;
                        case "number":
                            {
                                var num = Number(currentValue);
                                if (typeof num === "number") {
                                    res = num;
                                }
                                else {
                                    var error = Translation.translate("message.command.invalid_number_type")
                                        .replace("%s", arguments_name_1[currentIndex]);
                                    Game.message(Native.Color.RED + error);
                                    return;
                                }
                                ;
                                break;
                            }
                            ;
                        case "any":
                            {
                                var num = Number(currentValue);
                                if (typeof num === "number") {
                                    res = num;
                                }
                                else {
                                    res = currentValue;
                                }
                                ;
                                break;
                            }
                            ;
                    }
                    ;
                    result[arguments_name_1[currentIndex]] = res;
                    return result;
                }, {});
                if (current instanceof ServerCommand) {
                    Network.sendToServer("packet.command.server." + current.caller, arguments_1);
                    return { value: void 0 };
                }
                ;
                if (current instanceof ClientCommand) {
                    current.onCall(arguments_1);
                    return { value: void 0 };
                }
                ;
            }
            else {
                Game.prevent();
                var message = Translation.translate("message.command.not_enough_arguments")
                    .replace("%s", current.require_count.toString())
                    .replace("%d", args.length.toString());
                Game.message(Native.Color.RED + message);
            }
            ;
        }
        ;
    };
    for (var i in Command.list) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    ;
});
/*Callback.addCallback("NativeCommand", (command) => {
    const splited = command.split(" ");
    
    if(command === "/commandlib help") {
        for(const i in Command.list) {
            const current = Command.list[i];
            let index = 0;
            Game.message(index + "." + " " + "/" + current.caller + " " + Object.keys(current.arguments).
            reduce((pv, cv) => {
                pv +=  "<" + cv + ">" + " ";
                return pv;
            }, ""));
            index++
        }
        return;
    }
    
    for(const i in Command.list) {
        const current = Command.list[i];
        if("/" + current.caller === splited[0]) {
            const args = splited.splice(1);

            if(current.require_count <= 0 || args.length >= current.require_count) {
                Game.prevent();
                const arguments_name = Object.keys(current.arguments);
                const arguments_type = Object.values(current.arguments);

                const arguments = args.slice(0, Math.min(args.length, arguments_name.length))
                .reduce<Record<string, any>>((result, currentValue, currentIndex) => {
                    let res: unknown = currentValue;

                    switch(arguments_type[currentIndex]) {
                        case "boolean": {
                            if(currentValue === "true") {
                                res = true;
                            } else if(currentValue === "false") {
                                res = false;
                            } else {
                                const error = Translation.translate("message.command.invalid_boolean_type")
                                .replace("%s", arguments_name[currentIndex]);
                                
                                Game.message(Native.Color.RED + error);
                                return;
                            }
                            break;
                        }
                        case "string": {
                            res = currentValue;
                            break;
                        }
                        case "number": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                const error = Translation.translate("message.command.invalid_number_type")
                                .replace("%s", arguments_name[currentIndex]);

                                Game.message(Native.Color.RED + error);
                                return;
                            }
                            break;
                        }
                        case "any": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                res = currentValue;
                            }
                            break;
                        }
                    }
                    
                    result[arguments_name[currentIndex]] = res;
                    return result;
                }, {});

                if(current instanceof ServerCommand) {
                    Network.sendToServer("packet.command.server." + current.caller, arguments);
                    return;
                }

                if(current instanceof ClientCommand) {
                    current.onCall(arguments);
                    return;
                }
            } else {
                Game.prevent();

                const message = Translation.translate("message.command.not_enough_arguments")
                .replace("%s", current.require_count.toString())
                .replace("%d", args.length.toString());

                Game.message(Native.Color.RED + message);
            }
        }
    }
});*/ 
EXPORT("Command", Command);
EXPORT("ClientCommand", ClientCommand);
EXPORT("ServerCommand", ServerCommand);

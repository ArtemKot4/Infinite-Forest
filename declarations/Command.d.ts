/**
 * Библиотека открыта для всех желающих удобно создавать команды.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
interface ICommandParams {
    /**
     * Entity list got from native format:
     * @s caller
     * @p caller
     * @a all players
     * @e all entities
     * Must be registered in constructor.
     */
    initiator?: {
        entities: number[] | [];
        players: number[] | [];
        caller: number;
    };
}
type ArgumentTypes = "string" | "number" | "boolean" | "any";
declare abstract class Command {
    static list: Record<string, Command>;
    caller: string;
    arguments: Record<string, ArgumentTypes>;
    require_count: number;
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    getDescription(): string;
    static register(command: Command): void;
}
/**
 * Class to create your client side commands.
 */
declare abstract class ClientCommand<T extends Object = {}> extends Command {
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    /**
     * Method, works after player send a command in chat in client side.
     * @param data your arguments from client
     */
    abstract onCall(data: T): void;
}
/**
 * Class to create your server & client side commands
 */
declare abstract class ServerCommand<T extends Object = {}> extends Command {
    static initiator_chars: string[];
    /**
     * @param caller string name of your command
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    /**
     * Method, works on client. If you use it, you must send it packet from server.
     * @param data data from server
     * @returns void;
     */
    protected onClient(data: T): void;
    /**
     * Method, works after player send a command in chat in server side.
     * @param client client, that send your command in game
     * @param data your arguments from client
     */
    abstract onServer(client: NetworkClient, data: T): void;
    /**
     * Method to parse arguments: initiator -> @s, @p, @a, @e.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     * @returns
     */
    protected getParsedData(client: NetworkClient, data: T): T;
    /**
     * Method that create packets;
     */
    protected buildPacket(): void;
    /**
     * Method to call client function. Sends packet to client.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     */
    protected sendToClient(client: NetworkClient, data: T): void;
    /**
     * Method, sends message to client.
     * @param client just NetworkClient from server side
     * @param message any string message
     */
    protected sendMessageToClient(client: NetworkClient, message: string): void;
    /**
     * Method to call client function with all valid players.
     * @param data your arguments from client
     */
    protected sendToAllClients(data: T): void;
}
declare class ListCommand extends ClientCommand {
    constructor();
    onCall(data: {}): void;
}

declare type ArgumentTypes = "string" | "number" | "boolean" | "any";

declare abstract class Command {
    public static list: Record<string, Command>;
    public caller: string;
    public arguments: Record<string, ArgumentTypes>;
    public require_count: number;
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
}

declare interface ICommandParams {
    entities?: {
        entities: number[] | [],
        players: number[] | [],
        caller: [number]
    };
}

declare abstract class ClientCommand<T extends ICommandParams> extends Command {
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    abstract onCall(data: T): void;
    abstract onCall(): void;
}

declare abstract class ServerCommand<T extends ICommandParams> extends Command {
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number);
    public onClient(data: T): void;
    abstract onServer(client: NetworkClient, data: T): void;
    public buildPacket(): void;
    public sendToClient(client: NetworkClient, data: T): void;
    public sendMessageToClient(client: NetworkClient, message: string): void;
    public sendToAllClients(data: T): void;
}

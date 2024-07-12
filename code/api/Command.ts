
Callback.addCallback("NativeCommand", (command) => {
  if (command === "/if:learnings delete") {
  }
});

abstract class Command {
  public static list: { name: string; player?: int; list: string[] };
  public static registry(name: string, player: boolean, arg1: string) {}
}

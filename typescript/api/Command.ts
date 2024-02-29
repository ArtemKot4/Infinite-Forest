
namespace Command {
    export const data = {
      gamerules: {begin: "gamerule if:", list: {}}
    }
    export function registerGamerule(name, func: (value) => void) {
      data.gamerules["list"][name] = {func: func};
    };
    export function setCustomGamerule(name: string, value: any) {
        data.gamerules["list"][name]["func"](value)
    }
  };

  Command.registerGamerule("test", (value) => {
    return Game.message(value == "one" ? "It's one": "It's two")
  })
namespace Researchs {
  export const player_data = {};
  export function registerQuestion(
   player: int,
    desc: { question: name; translations: Record<string, string> }
  ) {
    if (!desc) return;
    Translation.addTranslation(desc.question, desc.translations);
      const client = Network.getClientForPlayer(player);
    if (!client) return null;
    client.send("if.question", {
      player,
      question: Translation.translate(desc.question),
    });
        };
    };

    


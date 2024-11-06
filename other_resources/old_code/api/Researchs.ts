namespace Researchs {
  export const player_data: Record<number, any> = {};
        export function setupQuestion(player, name) {
          const data_ = player_data[player];

           if(data_ && data_.questions.includes[name]) {
            Game.message("Эта мысль уже была получена!: " + name);
            return false;
           }; 
           data_.questions.push(name);
        }
    };



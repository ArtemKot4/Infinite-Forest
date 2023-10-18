declare namespace Futurepack {
export function addFuturetock (id: string | number, volt: number): void
}

declare namespace MachineRecipeRegistry {
    type id = string;
  enum obj{id,count}
  
  export function registerRecipesFor (
    blockID: string | number,result: id,id: obj.id,count: obj.count
   )

   
  export function requireRecipesFor (name:string, createIfNotFound: boolean): any
    
  export function getRecipeResult (name: string, key1:any,key2:any): any
    
  export function hasRecipeFor (name: string, key1: any, key2: any): any
//    let researchs = {
//   researchs: []
//    };
   
}
declare namespace player {function func (): void}
declare namespace KEX {
  namespace GlobalContext { function getLocalPlayer()}
 
}


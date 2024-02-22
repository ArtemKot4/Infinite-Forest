// class Infinite {
//   protected dimension = InfiniteForest.id;
//   protected isForest(): boolean {
//     if (Player.getDimension() == this.dimension) {
//       return true;
//     }
//   }
// }

type int = number;
type universal = string | number;
type name = string;



const Mistical = new Sound("Light.ogg");
const Opening = new Sound("Opening.ogg");

var BLOCK_TYPE_FIRE = Block.createSpecialType({
  lightlevel: 8,
  rendertype: 91,
  sound: "grass",
});
var BLOCK_TYPE_PRINT = Block.createSpecialType({
  lightlevel: 10,
  sound: "glass",
  destroytime: -1,
});
/**
 * Функция для получения массива с числами от min до max 
 * @min первое число
 * @max последнее число
 * @возвращает [min, ... ,max]
 */
function range(min: int, max: int): int[] {
  const arr = [];
  for(let i = min; i <= max; i++){
arr.push(i)
}
return arr; 

}

function getFour(id, coords, player){
  const block = BlockSource.getDefaultForActor(player).getBlock(coords.x, coords.y, coords.z);
 // if()
};

const MODELSDIR = __dir__+"assets/models/"


//excludes functions of js

const ObjectValues = function(obj) { 
  return Object.keys(obj).map(function(v) { 
  return obj[v] 
  }) 
 } 
  
 /**
  * ObjectAssign -> реализация недостающего метода Object.assign
  * @include объект для дополнения
  * @objs объекты для слияния
  * @возвращает include 
  */
 function ObjectAssign (include: {}, ...objs: {}[]){ 
   for(const a in objs){
  let ik = Object.keys(objs[a])
  const kk = ObjectValues(objs[a]) 
  for(const i in ik){ 
  for(const k in kk) { 
  include[ik[i]] = kk[i] 
  } 
  } }
  return include 
 }
 
 /**
 * Функция для постановки интервала выполнения чего-либо в тиках
 * @func функция
 * @time время в тиках
 */ 
 function setTickInterval(func: (...any) => any, time: int) {
     const valid = true;
     if(!valid) return;
     if(World.getThreadTime()%time==0) {
        return func();
     };
     this.resetInterval = function(): void {
         valid = false;
         return;
     }
 }

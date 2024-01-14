# Infinite Forest
Документация по API Infinite Forest
### Класс FItem
Класс FItem позволяет удобно и быстро создавать различные предметы.
> Регистрация и параметры
```ts
new FItem(id: string, stack?: number, name?: string, texture?: string, meta?: number, isTech?: boolean): FItem;
```
- **id** -- строковый идентификатор
- **stack** -- количество предметов в стаке
- **name** — название предмета
- **texture** — название текстуры 
 - **meta** — индекс текстуры
 - **isTech** — будет ли предмет добавлен в креатив
> Пример 
```ts
new FItem("orange_crystal", 1);
```
***
> Анимированный предмет
```ts
new FItem(id: string, stack?: number, name?: string, [texture: string, frame: number, time: number?], meta?: number, isTech?: boolean): FItem;
```
- **id** -- строковый идентификатор
- **stack** -- количество предметов в стаке
- **name** — название предмета
- [ **texture,** — название текстуры \
 **frame,** — число кадров \
 **time** ] — время 
 - **meta** — индекс текстуры
 - **isTech** — будет ли предмет добавлен в креатив
 > Пример
 ```ts
 new FItem("infinite_shark",1, "Infinite shark", ["infinity_fragment", 8])
 ```
 ***
 Функция **getItemForHand** \
 \
 Срабатывает, когда игрок берёт предмет в руку
 > Синтаксис
 ```ts
 getItemForHand(func: () => void): void;
 ```
 - **func** — функция, срабатывающая когда игрок берёт в руку предмет
 > Пример
 ```ts
 new FItem("example").getItemForHand(()=>{
 Game.message("Успешно!")
 });
 ```
 ***
  Функция **onUse** \
  \
  Срабатывает при использовании предмета
  > Синтаксис
 ```ts
onUse(func: (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile) => void): void
 ```
 - **func** -- функция, срабатывающая при использовании предмета
 > Пример
 ```ts
 new FItem("example").onUse((coords, item, block) => {
  Game.message("Успешно!")
 });
  ```
  ***
 Функция **info** \
 \
 Регистрирует описание для предмета, срабатывающее когда игрок использует shift
 > Синтаксис
  ```ts
 info(text: string, translation: {});
 ```
 - **text** — текст который нужно показать
 - **translation** — объект с описанием переводов
 > Пример
   ```ts
   new FItem("example").info("For example", {ru: "Для примера"})
 ```
 ***
 Функция **setCategory** \
 \
 Ставит категорию предмету
 > Синтаксис 
 ```ts
 setCategory(int: number): void
 ```
 ### Функция range
 Возвращает массив с числами от min до max
 > Синтаксис
 ```ts
range(min: number, max: number): number[]
```
- **min** — первое число
- **max** — последнее число
> Пример
```ts
range(3, 10) // [3, 4, 5, 6, 7, 8, 9 , 10]
```
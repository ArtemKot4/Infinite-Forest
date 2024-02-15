# Infinite Forest

Документация по API Infinite Forest

### Класс FItem

Класс FItem позволяет удобно и быстро создавать различные предметы.

> Регистрация и параметры

```ts
const item: FItem = new FItem(id: string, stack?: number, name?: string, texture?: string, meta?: number, isTech?: boolean);
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
const anim_item: FItem = new FItem(id: string, stack?: number, name?: string, [texture: string, frame: number, time: number?], meta?: number, isTech?: boolean);
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
    const example: FItem = new FItem("infinite_shark", 1, "Infinite shark", ["infinity_fragment", 8])
    ```
  
  ***
  
  Функция **getItemForHand** \
  \
  Срабатывает, когда игрок берёт предмет в руку.
  
  > Синтаксис
  
  ```ts
  getItemForHand(func: () => void): void;
  ```
  
  - **func** — функция, срабатывающая когда игрок берёт в руку предмет
    
    > Пример
    
    ```ts
    const example_item: FItem = new FItem("example").getItemForHand(() => {
    Game.message("Успешно!")
    });
    ```
  
  ***
  
  Функция **onUse** \
  \
  Срабатывает при использовании предмета.
  
  > Синтаксис
  
  ```ts
  onUse(func: (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile) => void): void
  ```
  
  - **func** -- функция, срабатывающая при использовании предмета
    
    > Пример
    
    ```ts
    const example_item: FItem = new FItem("example").onUse((coords, item, block) => {
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
    const example_item: FItem = new FItem("example").info("For example", {ru: "Для примера"})
    ```
  
  ***
  
  Функция **setCategory** \
  \
  Ставит категорию предмету.
  
  > Синтаксис 
  
  ```ts
  setCategory(int: number): void
  ```
  
  ### Функция range
  
  Возвращает массив с числами от min до max.
  
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
  
  ***
  
  ### Класс WorkbenchRecipe
  
  Класс, предназначенный для создания рецептов для любых блоков, чей UI имеет 9 слотов под каждый зарегистрированный предмет.
  
  > Объявление
  
  ```ts
  const recipe: WorkbenchRecipe = new WorkbenchRecipe() //конструктор не принимает параметров
  ```

***

 Функция **registry** \
\
 Регистрирует рецепт для вашего предмета

> Синтаксис

```ts
registry( item: int, 
  description: 
    [first: string, 
    second: string, 
    third: string], 
       obj: {}): void;
```

- **item** — числовой идентификатор блока / предмета

- **description** :
  [ **first,** — первый ряд -> строка, которая должна содержать в себе 3 символа \
   **second,** — второй ряд -> строка, которая должна содержать в себе 3 символа \
   **third** ] — третий рд -> строка, которая должна содержать в себе 3 символа 

- **obj** — объект, который должен описывать каждый указанный элемент.  
  
  > Пример
  
  ```ts
  
  const infinite_recipes: WorkbenchRecipe = new WorkbenchRecipe();new FItem("infinite_book", 1);infinite_recipes.registry(ItemID["infinite_book"], [ "abc", "dhc", "bca"], {a: 25, b: 7, c: 3, d: 9, h: 63,});
  ```





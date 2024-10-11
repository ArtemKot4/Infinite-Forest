// LIBRARY({
//     name: "Tags",
//     version: 1,
//     shared: true,
//     api: "CoreEngine"
// });

// const Tags = {
//     list: {},
//     register(name, list) {
//         this.list[name] = list || []
//     },
//     has(name, id) {
//         return this.list[name].includes(id);
//     },
//     get(name) {
//         return this.list[name]
//     },
//     getName(id) {
//         for(let i in this.list) {
//             let list = this.list[i];
//             if(list.includes[id]) {

//             }
//         }
//     }
// }

// EXPORT("Tags", Tags); //TODO: Жду пока Макс допишет декларацию чтобы не юзать свою либу
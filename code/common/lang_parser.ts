//coming soon.
/*
const lang = "on: он\ntest: чтророро \n//привет\nitem.lol = Лол предмет // ы\nitem.troll = `${test}` и не только\nhello = Привет"

function parse(lang, file) {
    const obj = {

    }
    const keywords = {
      
	}
    
    const splited = file.split("\n");
    for(const i in splited) {
		const line = splited[i].trim();
        if(line.length == 0) {
          	continue;
        }
      	if(line.startsWith("//")) {
          	continue;
        }
      
      	if(!line.includes("=") && line.includes(":")) {
          	let [key, value] = line.split(":").map(v => v.split("//")[0].trim());
          	keywords[key] = value;
          	continue;
        }

      	let [key, value] = line.split("=").map(v => v.split("//")[0].trim());
        if(value.includes("`${")) {
            for(let index = 0; index < value.length; index++) {
              let lastStart = value.slice(index).indexOf("`${")
              if(lastStart == -1) {
                continue;
              }
              let lastEnd = value.slice(lastStart).indexOf("}`");
              value = value.replace(value.slice(lastStart, lastEnd + 2), keywords[value.slice(lastStart + 3, lastEnd)] || "error")
            }
         
        	           
 		}
      	obj[key] = value;
  	}
  	return obj;
}

console.log(JSON.stringify(parse("ru", lang)))
*/


abstract class Recipe {
    public pool: any[] = [];
   public registry(obj: {}) {
    const value = Object.values(obj);
    const key = Object.keys(obj);
    for(let i in Object.keys(obj)){
       for(let k in Object.values(obj)){
       
        this.pool.push(`${key[i]}:${value[k]}`)
       }
    }

   }
}
function range(min: number, max: number): number[] {
    const list = [];

    for(let i = min; i < max; i++) {
        list.push(i);
    };

    return list;
}
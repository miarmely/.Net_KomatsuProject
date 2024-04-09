export function getValuesOfObject(object) {
    let values = [];

    for (let key in object)
        values.push(object[key]);
   
    return values;
}
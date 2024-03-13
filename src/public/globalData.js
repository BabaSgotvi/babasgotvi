export let tempFiles = [];
export function tempSet(value, id) {
    let check = tempGet(id);
    if (check == null) {
        tempFiles.push({ value, id });
    }
    else if (check != null && check != { value, id }) {
        tempFiles[tempGetIndex(id)] = { value, id };
    }
    console.log("set: " + { value, id });
}
export function tempGet(id) {
    // Loop through the array to find the object with the specified key
    for (let i = 0; i < tempFiles.length; i++) {
        if (tempFiles[i].id === id) {
            // Return the object if the key matches
            return tempFiles[i];
            console.log("got: " + tempFiles[i]);
        }
    }
    // Return null if the key is not found in any object
    return null;
}
export function tempGetIndex(id) {
    for (let i = 0; i < tempFiles.length; i++) {
        if (tempFiles[i].id === id) {
            return i;
        }
    }
    // Return null if the key is not found in any object
    return null;
}

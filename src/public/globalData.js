import { get } from "wix-data";

let items = [];

export function setItem(value, key) {
    let check = getFullItem(key);
    if (check == null) {
        items.push({ value: value, key: key });
    } else if (check != null && check != { value, key }) {
        items[getIndex(key)] = { value: value, key: key };
    }
}

export function getItem(key) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
            return items[i].value;
        }
    }
    return null;
}

function getFullItem(key) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
            return items[i];
        }
    }
    return null;
}

function getIndex(key) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
            return i;
        }
    }
    return null;
}

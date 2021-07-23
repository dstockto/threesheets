export default class Storage {
    static storage = window.localStorage;

    static getItem(name, type, defaultValue) {
        const value = Storage.storage.getItem(name) || defaultValue;

        switch (type) {
            case 'int':
                return parseInt(value, 10);

            case 'float':
                return parseFloat(value);

            case 'json':
                return JSON.parse(value);

            case 'array':
                return JSON.parse('[' + value + ']');

            default:
                return value;
        }
    }

    static setItem(name, value) {
        value = typeof value !== 'string'
            ? value.toString()
            : value;

        Storage.storage.setItem(name, value);
    }

    static removeItem(name) {
        Storage.storage.removeItem(name);
    }

    static clear() {
        Storage.storage.clear();
    }
}
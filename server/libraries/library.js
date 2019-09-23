class Library {

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //TODO fix createMap to iterate different types of objects
    //TODO and be able to specify key and value fields
    static createMap(data, keyField, valueField) {
        var tempMap = new Map();

        for (let [key, value] of Object.entries(data)) {
            let k = key;
            let v = value;
            tempMap.set(key, value);
        }

        return tempMap;


        // for (let i = 0; i <= data.length; i++) {
        //     if (data[i]) {
        //         let currElem = data[i];
        //         //TODO this doesn't make sense. Fix it
        //         let currKey = key === '*' ? currElem : currElem[key];
        //         let currVal = value === '*' ? currElem : currElem[value];
        //         tempMap.set(currKey, currVal);
        //     }
        // }

        return tempMap;
    }

}

module.exports = Library;
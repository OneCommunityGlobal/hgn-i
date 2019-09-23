// import config from "../config/config.json";

class Library {
    static xxx = "";

    static mapArrayOfObjects(data, keyField=null) {
        var tempMap = new Map();

        for (let [key, value] of Object.entries(data)) {
            let k = data[key][keyField];
            let v = value;
            tempMap.set(k, v);
        }

        return tempMap;
    }

    static hideModal(modalName) {
        let $ = window.$;
        let modal = '#'+modalName;
        $(modal).modal('hide');
    }

    static setModalCloseRoutine(modalName, closeFunction) {
        let $ = window.$;
        let modal = '#'+modalName;
        $(modal).on('hidden.bs.modal', function () {
            closeFunction();
        });   
    }
}

export default Library;

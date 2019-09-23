const Library = require('./library');
const ObjectID = require('mongodb').ObjectID;

class MongoLibrary extends Library {

    //Converts a string ID to a valid Mongdo ID object
    static convertStrIdToObject(strId) {
        try {
            return ObjectID(strId);
        } catch {
            return false;
        }
    }

    //TODO allow sending of objects and/or array of objects
    static convertStrIdsToObjects(itemToConvert) {
        var response = {};
        var oldItem = itemToConvert;
        var newArray = [];

        oldItem.forEach(function (element) {
            let tmpObject = {};
            response = MongoLibrary.validateId(element.id);
            if (!response.success) return response;
            const elementIdObj = response.data;
            tmpObject.id = elementIdObj;
            tmpObject.name = element.name;
            newArray.push(tmpObject);
        });

        return newArray;
    }

    static validateId(strId) {
        var idObj = null;
        var response = {};

        //Try to convert the id. This will throw an exception if not valid so wrapped in try/catch
        try {
            idObj = ObjectID(strId);
        } catch {
            response = {};
            response.success = false;
            response.message = 'A string id passed is not a valid Mongodb string id';
            return (response);
        }

        //If we're here then the id is valid
        response = {};
        response.success = true;
        response.data = idObj;
        return response;
    }

    static async checkRecordExistsById(collection = null, recordIdObj = null) {
        var response = {};

        const numRecs = await this.countDocuments(collection, '_id', recordIdObj);
        if (!numRecs > 0) {
            response = {};
            response.success = false;
            response.message = 'Record does not exist';
            return response;
        }

        response.success = true;
        return response;
    }

    static async checkRecordExistsByField(collection = null, fieldName, fieldValue = null) {
        var response = {};

        const numRecs = await this.countDocuments(collection, fieldName, fieldValue);
        if (!numRecs > 0) {
            response = {};
            response.success = false;
            response.message = 'Record does not exist';
            return response;
        }

        response.success = true;
        return response;
    }

    static async getUserInfo(userIdObj) {
        const collection = db.collection('users');
        const query = { "_id": userIdObj };
        const project = { "_id": 0, "isAdmin": 1, "userName": 1 };
        const options = {};

        const result = await collection.find(query, options).limit(1).project(project).toArray();
        if (!result.length > 0) {
            let response = {};
            response.success = false;
            response.message = 'Unable to retrieve users info';
            return (response);
        }

        let response = {};
        response.success = true;
        response.data = result[0];
        return (response);
    }

    //TODO finish this - returns count or response ?
    static async countDocuments(collectionName, fieldName, fieldValue) {
        const collection = db.collection(collectionName);
        const query = { [fieldName]: fieldValue };
        const options = {};
        const numRecs = await collection.countDocuments(query, options);
        return numRecs;
    };

}

module.exports = MongoLibrary;
const Validator = require('./validator');
const SchemaModel = require('./schema-model');

//TODO Chose to have all methods static because state was not important across calls
//TODO But isAdmin is used across some methods so fix to avoid multiple calls in one session
class Model {
    //This class cannot be instantiated with "new"
    constructor() {
        if (this.constructor === Controller) {
            throw new TypeError('Class cannot be instantiated directly.');
        }
    }

    static async validateDocument(collectionName, schemaName, document, options) {
        let schema = await SchemaModel.getSchema(schemaName);
        let validator = new Validator(collectionName, schema, document, options);
        return await validator.validateDocument();
    }

    //This routine will be used to validate a query e.g. non admin asking for all records
    static async validateQuery(requestorIdObj, queryObj) {
        var response = {};

        //TODO query validity checks : only admin can return all user records ie empty query etc...
        response = await MongoLibrary.getUserInfo(requestorIdObj);
        if (!response.success) return response;
        var requestorIsAdmin = response.data.isAdmin;

        //Do we let admins access all documents in all collections?
        if (isAdmin) {
            response.success = true;
            response.data = query;
            return response;
        }

        //TODO Specify what dbMethods are allowed to have empty querys for non-admins
        if (query && query === {} && !isAdmin) {
            response.success = false;
            response.message = 'Not a valid query';
            return response;
        }

        response.data = query;
        response.success = true;
        return response;
    }

    //Converts a document object ie "{key:value}" to Mongo update object ie "{$set {key:value}}"
    //TODO this is roughed in. Fill out with better logic and checking
    static convertDocToUpdate(document) {
        const updateDoc = { $set: document };
        return updateDoc;

        for (let [key, value] of Object.entries(document)) {
            // { $set: { <field1>: <value1>, ... } }
            { $set: { key: value } };
        }

        return updateDoc;
    }

    static async insertOne(collectionName, document, options = {}) {
        const collection = db.collection(collectionName);
        const query = null;
        var response = {};

        let result = await collection.insertOne(document, options);
        if (result.insertedCount > 0) {
            let iid = result.insertedId;
            response.success = true;
            response.data = { "insertedId": iid };
            response.numRecs = result.insertedCount;
            return response;
        } else {
            response.success = false;
            response.data = null;
            response.message = "No Documents Inserted";
            return response;
        }
        return response;
    }

    static async findOne(collectionName, query, options = {}) {
        const collection = db.collection(collectionName);
        const project = options.project ? options.project : {};
        var response = {};

        const result = await collection.find(query, options).limit(1).project(project).toArray();

        if (result.length > 0) {
            response.success = true;
            response.data = result[0];
            response.numRecs = result.length;
            return response;
        } else {
            response.success = false;
            response.data = null;
            response.message = "No Documents Found";
            return response;
        }
    }

    static async findMany(collectionName, query = null, options = {}) {
        const collection = db.collection(collectionName);
        const project = options.project ? options.project : {};
        var response = {};

        // Get the cursor
        const cursor = await collection.find(query, options).project(project);

        // Iterate over the cursor
        const docsArr = [];
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            docsArr.push(doc);
        }

        if (docsArr.length > 0) {
            response.success = true;
            response.data = docsArr;
            response.numRecs = docsArr.length;
            return response;
        } else {
            response.success = false;
            response.data = null;
            response.message = "No Documents Found";
            return response;
        }
    }

    static async findByAggregate(collectionName, pipeline = null, options) {
        const collection = db.collection(collectionName);
        var response = {};

        // Get the cursor
        const cursor = await collection.aggregate(pipeline, options);

        // Iterate over the cursor
        const docsArr = [];
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            docsArr.push(doc);
        }

        if (docsArr.length > 0) {
            response.success = true;
            response.data = docsArr;
            response.numRecs = docsArr.length;
            return response;
        } else {
            response.success = false;
            response.data = null;
            response.message = "No Documents Found";
            return response;
        }
        return response;
    }

    static async updateOne(collectionName, query, update, options = {}) {
        const collection = db.collection(collectionName);
        options.multi = false;
        var response = {};

        const result = await collection.updateOne(query, update, options);

        if (result.modifiedCount > 0) {
            response.success = true;
            response.data = null;
            response.numRecs = response.modifiedCount;
            return response;
        } else {
            response.success = false;
            response.data = null;
            response.message = "No Documents Updated";
            return response;
        }
        return response;

    }

    static async deleteOne(collectionName, query, options = {}) {
        const collection = db.collection(collectionName);
        options.justOne = true;
        var response = {};

        let result = await collection.deleteOne(query, options);
        if (!result.deletedCount > 0) {
            response.success = false;
            response.data = null;
            response.message = 'No Documents Were Deleted';
            return response;
        }

        //If here document was successfully deleted
        response.success = true;
        response.data = null;
        response.message = 'Document Successfully Deleted';
        return response;
    }
}

module.exports = Model;
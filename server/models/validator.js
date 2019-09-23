const Library = require('../libraries/library');
const MongoLibrary = require('../libraries/mongo-library');
const bcrypt = require('bcryptjs');

/* Notes: if certain things are not valid then an error should be returned such
    as missing required fields or duplicate unique fields.
    In other instances processing should continue thru all fields and any errors or warnings should
    be logged in the this.errors property and returned. Maybe indicate an error vs a warning and process
    differently based on that? Allow adding documents to the 
    database if minor field values are invalid by setting those fields to their defaults rather than writing
    an invalid value to the document?
*/

//TODO should be able to reuse this on the front end
//TODO different criteria for insert vs update? use dbMethod
//TODO use regex field in schema to validate further than just type e.g. passwords
//TODO convert passwords before storing
class Validator {
    constructor(collectionName, schema, document, options = {}) {
        this.collectionName = collectionName;
        this.schema = schema;
        this.document = document;
        this.dbMethod = options.dbMethod ? options.dbMethod : null;
        this.level = options.level ? options.level : "document";
        this.required = this.schema.required;
        this.propertiesMap = Library.createMap(this.schema.properties);
        this.documentMap = Library.createMap(this.document);
        this.errors = [];
        this.hasErrors = false;
        this.errCode = null;
        this.hasWarnings = false;
    }

    convertMapToObject(myMap) {
        const obj = {};
        myMap.forEach((v, k) => { obj[k] = v });
        return obj;
    };

    checkRequired() {
        for (let i = 0; i < this.required.length; i++) {
            let currDocField = this.required[i];
            if (!this.documentMap.get(currDocField)) {
                let missingFieldMessage = `A required field: "${currDocField}" is missing from the document`;
                this.errors.push({ [currDocField]: missingFieldMessage });
                this.hasErrors = true;
            }
        }
    }

    checkType(schElem, fieldName, fieldValue, type) {
        //TODO need to check types of sub elements. Move to own routine
        //check if type is valid
        let typeValid;
        switch (type) {
            case "string":
                typeValid = typeof fieldValue === type;
                break;
            case "int":
                typeValid = typeof fieldValue === 'number' && Number.isInteger(fieldValue);
                break;
            case "array":
                typeValid = Array.isArray(fieldValue);
                break;
            case "number":
                typeValid = !(Number.isNaN(fieldValue));
                break;
            case "date":
                //TODO this needs to be improved. Create routine in DateLibrary to check type is date?
                typeValid = true;
                break;
            case "boolean":
                //TODO this needs to be improved. Use moment or create routine?
                typeValid = typeof fieldValue === type;
                break;
            case "objectId":
                typeValid = typeof fieldValue !== 'undefined' && fieldValue._bsontype && fieldValue._bsontype === 'ObjectID';
                break;
            default:
                break;
        }

        if (!typeValid) {
            this.errors.push({ [fieldName]: `${fieldName} expected type ${type}` });
            if (typeof schElem.useDefaultIfInvalid !== "undefined" && schElem.useDefaultIfInvalid) {
                this.documentMap.set(`${fieldName}`, schElem.defaultValue);
                this.hasWarnings = true;
            } else {
                this.hasErrors = true;
            }
        }

        return;
    }

    async checkFields() {

        for (var [fieldName, fieldValue] of this.documentMap) {
            var schElem = this.propertiesMap.get(fieldName);

            //check if document element exists in the schema
            //TODO return immediately or just write error/warning?
            if (typeof schElem === "undefined" || !schElem) {
                this.errors.push({ [fieldName]: `The document field: ${fieldName} is missing from the schema` });
                this.documentMap.delete(fieldName);
                this.hasErrors = true;
                continue;
            }

            //If field is unique index, check it doesn't already exist
            if (typeof schElem.index !== "undefined" && schElem.index === 'unique') {
                //If update, cannot update unique index fields
                /*TODO Should not allow same name with different capitalizations so convert both
                    to upper or lower case before checking */
                if (this.dbMethod.substring(0, 6) === "update" || this.dbMethod.substring(0, 6) === "insert") {
                    let response = await MongoLibrary.checkRecordExistsByField(this.collectionName, fieldName, fieldValue);
                    if(response.success) {
                        this.errors.push({ [fieldName]: `This field has a unique index and cannot be updated` });
                        this.hasErrors = true;
                        this.errCode = 103;
                    }
                    continue;
                }

                let numRecs = await MongoLibrary.countDocuments(fieldName, fieldValue);
                //TODO do not return info to user about which field/value is a duplicate?
                //TODO could figure out existing user names or passwords
                if (numRecs !== 0) {
                    this.errors.push({ [fieldName]: `${fieldValue} already exists` });
                    this.hasErrors = true;
                    continue;
                }
            }

            this.checkType(schElem, fieldName, fieldValue, schElem.bsonType);

            //TODO validate field against regex if present
            if (schElem.regex) {
                let tmp = 1;
            }

            //TODO validate field as password and convert string to bcrypt
            if (schElem.subType === "password") {
                //TODO salt in config file
                var salt = null;
                var hash = bcrypt.hashSync(fieldValue);
                this.documentMap.set(`${fieldName}`, hash);
            }

            if (schElem.canUpdate && this.dbMethod.substring(0, 6) === "update") {
                let tmp = 1;
            }
        }

        return;
    }

    async validateDocument() {

        if (this.level === "document") {
            let allRequiredExistInDocument = this.checkRequired();
        }

        await this.checkFields();

        if (this.hasErrors) {
            let response = {};
            response.success = false;
            response.data = null;
            response.errors = this.errors;
            response.errCode = this.errCode ? this.errCode : 0;
            response.message = 'There were some errors. Document is not valid';
            return (response);
        } else if (this.hasWarnings) {
            let response = {};
            response.success = true;
            response.data = this.convertMapToObject(this.documentMap);
            response.errors = this.errors;
            response.message = 'There were some warnings. Document is valid';
            return (response);
        } else {
            let response = {};
            response.success = true;
            response.data = this.convertMapToObject(this.documentMap);
            response.errors = [];
            response.message = 'Document is valid';
            return (response);
        }
    }

}

module.exports = Validator;
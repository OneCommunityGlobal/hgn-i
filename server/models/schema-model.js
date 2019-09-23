var FilesystemLibrary = require("../libraries/filesystem-library");

//TODO this file is roughed in. Fill out and fix
class SchemaModel {

    static async getSchema(schemaName, options = {}) {
        //TODO use a file convention that is based on the site url
        var filePath = __dirname + '/schemas/' + schemaName + '.json';

        let fileData = await FilesystemLibrary.getFileJSON(filePath);
        let schema = fileData.$jsonSchema;
        return schema;

    }
}

module.exports = SchemaModel;
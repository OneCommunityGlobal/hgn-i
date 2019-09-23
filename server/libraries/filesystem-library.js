const Library = require('./library');
const fs = require('fs');

//TODO this file is a rough fs library. Needs to be filled out and cleaned up.
class FilesystemLibrary {

  static convertToJSON(rawData) {
    try {
      let parsedData = JSON.parse(rawData);
      return parsedData;
    } catch (error) {
      console.log(error);
    }
  }

  static async getFileJSON(file, options={}) {
    let encoding = options.encoding ? options.encoding : 'utf8';

    var rawData = await fs.readFileSync(file, encoding);
    let jsonData = this.convertToJSON(rawData);
    return jsonData;
  }

}

module.exports = FilesystemLibrary;
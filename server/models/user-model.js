const Model = require('./model');

class UserModel extends Model {

  static async createUser(userDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('users', 'user-schema', userDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('users', userDocument, options);
    return response;
  }

  static async getUserByLogin(email) {
    const query = { 'email': email };
    const options = {};

    return await Model.findOne('users', query, options);
  }

  static async getUserById(userIdObj, options = {}) {
    var query = { "_id": userIdObj };

    return await this.findOne('users', query, options);
  }

  static async getUsersByProjectId(projectIdObj, options = {}) {
    var query = { "projects.id": projectIdObj };

    return await this.findMany('users', query, options);
  }

  static async getUsersByTeamId(teamId, options = {}) {
    var query = { "teams.id": teamId };

    return await this.findMany('users', query, options);
  }

  static async getUserByUserName(userName, options = {}) {
    var query = { "userName": userName };

    return await this.findOne('users', query, options);
  }

  static async getUsers(query = null, options) {
    const collectionName = 'users';

    //TODO validate query?

    return await Model.findMany(collectionName, query, options);
  }

  static async updateUserById(userIdObj, userDocument) {
    const options = {};
    const collectionName = 'users';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('users', 'user-schema', userDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": userIdObj };
    const updateDoc = this.convertDocToUpdate(userDocument);

    return await this.updateOne('users', query, updateDoc, options);
  }

  static async deleteUserById(userIdObj) {
    const options = {};
    const query = { "_id": userIdObj };

    //TODO validate query?

    return await this.deleteOne('users', query, options);
  }
}

module.exports = UserModel;
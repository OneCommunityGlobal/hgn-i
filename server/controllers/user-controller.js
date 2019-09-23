const Controller = require('./controller');
const UserModel = require('../models/user-model');
const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');
const UserLibrary = require('../libraries/user-library');

class UserController extends Controller {
  constructor() {
    super();
  }

  static async createUser({ requestorId = null, document = null, ...rest }) {
    const options = {};
    const userId = null;
    var response = {};
    var userDocument = document;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'createUser';
    securityObject.dbMethod = 'insertOne';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    //Convert project and team Id's into ObjectId's and validate they exist
    //TODO this needs to be cleaned up and improved
    if (typeof document.projects !== 'undefined' && document.projects.length > 0) {
      let origProjects = document.projects;
      const newProjects = MongoLibrary.convertStrIdsToObjects(origProjects);
      userDocument.projects = newProjects;
    }

    if (typeof document.teams !== 'undefined' && document.teams.length > 0) {
      let origTeams = document.teams;
      const newTeams = MongoLibrary.convertStrIdsToObjects(origTeams);
      userDocument.teams = newTeams;
    }

    //Add created and lastModified datetimestamps
    userDocument.createdDate = new Date();
    userDocument.lastModifiedDate = new Date();

    response = await UserModel.createUser(userDocument)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;
  }

  //You cannot validate security since the user is trying to log in so no requestor or userid
  static async getUserByLogin({ email = null, password = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    //When logging in always return the users full record?
    options.project = project;
    var response = {};

    response = await UserModel.getUserByLogin(email)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    //If no user record found with passed email, return error
    if (!response.success) {
      response.data = null;
      response.numRecs = 0;
      response.message = "Invalid email/password combination";
      response.errCode = 101;
      return response;
    }

    //TODO validate password
    let enteredPassword = password;
    let storedPassword = response.data.password;
    let passwordsMatch = await UserLibrary.validatePassword(enteredPassword, storedPassword);
    if (!passwordsMatch) {
      response.success = false;
      response.data = null;
      response.numRecs = 0;
      response.message = "Invalid email/password combination";
      response.errCode = 101;
      return response;
    }

    return response;
  }

  static async getUserById({ parm1 = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;

    const userId = parm1;
    response = MongoLibrary.validateId(userId);
    if (!response.success) return response;
    const userIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'getUserById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['userId'] = userId;
    securityObject['userIdObj'] = userIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await UserModel.getUserById(userIdObj, options)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;

  }

  static async getUserByUserName({ parm1 = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;
    const userName = parm1;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'getUserByUserName';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['userName'] = userName;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await UserModel.getUserByUserName(userName, options)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return (response);
      });

    return response;

  }

  //TODO This routine returns all users so should only be callable by admins.
  static async getUsers({ requestorId = null,
    project = {}, query = null, ...rest }) {

    const options = {};
    options.project = project;
    var response = {};

    //Because this returns all users, the call should not provide a userId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'getUsers';
    securityObject.dbMethod = 'findMany';
    securityObject.query = query;
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    query = {};
    response = await UserModel.getUsers(query, options)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;

  }

  static async getUsersByProjectId({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    options.project = { "_id": 1, "firstName": 1, "lastName": 1, "projects.id": 1 };

    const projectId = parm1;
    response = MongoLibrary.validateId(projectId);
    if (!response.success) return response;
    const projectIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'getUsersByProjectId';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await UserModel.getUsersByProjectId(projectIdObj, options)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;

  }

  static async getUsersByTeamId({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    options.project = { "_id": 1, "firstName": 1, "lastName": 1 };

    const teamId = parm1;
    response = MongoLibrary.validateId(teamId);
    if (!response.success) return response;
    const teamIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'getUsersByTeamId';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await UserModel.getUsersByTeamId(teamId, options)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;

  }

  static async updateUserById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {

    const options = {};
    var response = {};
    var userDocument = document;

    const userId = parm1;
    response = MongoLibrary.validateId(userId);
    if (!response.success) return response;
    const userIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'updateUserById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['userId'] = userId;
    securityObject['userIdObj'] = userIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    //Convert project and team Id's into ObjectId's and validate they exist
    //TODO this needs to be cleaned up and improved
    if (typeof document.projects !== 'undefined' && document.projects.length > 0) {
      let origProjects = document.projects;
      const newProjects = MongoLibrary.convertStrIdsToObjects(origProjects);
      userDocument.projects = newProjects;
    }

    if (typeof document.teams !== 'undefined' && document.teams.length > 0) {
      let origTeams = document.teams;
      const newTeams = MongoLibrary.convertStrIdsToObjects(origTeams);
      userDocument.teams = newTeams;
    }

    userDocument.lastModifiedDate = new Date();

    response = await UserModel.updateUserById(userIdObj, userDocument)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    if (response.success) {
      //Update was successful so get and return the updated record
      let result = await this.getUserById({ "requestorId": requestorId, "parm1": userId });
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  static async deleteUserById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const userId = parm1;
    response = MongoLibrary.validateId(userId);
    if (!response.success) return response;
    const userIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'users';
    securityObject.method = 'deleteUserById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['userId'] = userId;
    securityObject['userIdObj'] = userIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await UserModel.deleteUserById(userIdObj)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    return response;

  }

};

module.exports = UserController;

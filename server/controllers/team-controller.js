const Controller = require('./controller');
const TeamModel = require('../models/team-model');
const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');

class TeamController extends Controller {

  static async createTeam({ requestorId = null, document = null, ...rest }) {
    const options = {};
    const teamId = null;
    var response = {};
    var teamDocument = document;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this team
    let securityObject = {};
    securityObject.collectionName = 'teams';
    securityObject.method = 'createTeam';
    securityObject.dbMethod = 'insertOne';
    securityObject.requestorId = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    //Convert string managerId to objectId
    if (typeof document.managerId !== 'undefined' && document.managerId) {
      const managerIdObj = MongoLibrary.convertStrIdToObject(document.managerId);
      //TODO check for false returned so no managerId object
      teamDocument.managerId = managerIdObj;
    }

    teamDocument.createdDate = new Date();
    teamDocument.lastModifiedDate = new Date();

    response = await TeamModel.createTeam(teamDocument)
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

  static async getTeamById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const teamId = parm1;
    response = MongoLibrary.validateId(teamId);
    if (!response.success) return response;
    const teamIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this team
    let securityObject = {};
    securityObject.collectionName = 'teams';
    securityObject.method = 'getTeamById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['teamId'] = teamId;
    securityObject['teamIdObj'] = teamIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TeamModel.getTeamById(teamIdObj, options)
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

  //TODO This routine returns all teams so need to determine the security for this.
  static async getTeams({ requestorId = null, ...rest }) {

    const options = {};
    var response = {};

    //Because this returns all teams, the call should not provide a teamId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this team
    let securityObject = {};
    securityObject.collectionName = 'teams';
    securityObject.method = 'getTeams';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TeamModel.getTeams(options)
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

  static async updateTeamById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {

    const options = {};
    var response = {};
    var teamDocument = document;

    const teamId = parm1;
    response = MongoLibrary.validateId(teamId);
    if (!response.success) return response;
    const teamIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this team
    let securityObject = {};
    securityObject.collectionName = 'teams';
    securityObject.method = 'updateTeamById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['teamId'] = teamId;
    securityObject['teamIdObj'] = teamIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    teamDocument.lastModifiedDate = new Date();

    response = await TeamModel.updateTeamById(teamIdObj, teamDocument)
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
      let result = await this.getTeamById({ "requestorId": requestorId, "teamId": teamId });
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  static async deleteTeamById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const teamId = parm1;
    response = MongoLibrary.validateId(teamId);
    if (!response.success) return response;
    const teamIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this team
    let securityObject = {};
    securityObject.collectionName = 'teams';
    securityObject.method = 'deleteTeamById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['teamId'] = teamId;
    securityObject['teamIdObj'] = teamIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await TeamModel.deleteTeamById(teamIdObj)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

    //TODO delete team from users

    return response;

  }

};

module.exports = TeamController;

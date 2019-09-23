const Controller = require('./controller');
const ProjectModel = require('../models/project-model');

const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');

class ProjectController extends Controller {

  static async createProject({ requestorId = null, document = null, ...rest }) {
    const options = {};
    const projectId = null;
    var response = {};
    var projectDocument = document;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this project
    let securityObject = {};
    securityObject.collectionName = 'projects';
    securityObject.method = 'createProject';
    securityObject.dbMethod = 'insertOne';
    securityObject.requestorId = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    //Convert string managerId to objectId
    if (typeof document.managerId !== 'undefined' && document.managerId) {
      const managerIdObj = MongoLibrary.convertStrIdToObject(document.managerId);
      //TODO check for false returned so no managerId object
      projectDocument.managerId = managerIdObj;
    }

    projectDocument.createdDate = new Date();
    projectDocument.lastModifiedDate = new Date();

    response = await ProjectModel.createProject(projectDocument)
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

  static async getProjectById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const projectId = parm1;
    response = MongoLibrary.validateId(projectId);
    if (!response.success) return response;
    const projectIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this project
    let securityObject = {};
    securityObject.collectionName = 'projects';
    securityObject.method = 'getProjectById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['projectId'] = projectId;
    securityObject['projectIdObj'] = projectIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await ProjectModel.getProjectById(projectIdObj, options)
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

  //TODO This routine returns all projects so need to determine the security for this.
  static async getProjects({ requestorId = null, ...rest }) {

    const options = {};
    var response = {};

    //Because this returns all projects, the call should not provide a projectId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this project
    let securityObject = {};
    securityObject.collectionName = 'projects';
    securityObject.method = 'getProjects';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await ProjectModel.getProjects(options)
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

  static async updateProjectById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {

    const options = {};
    var response = {};
    var projectDocument = document;

    const projectId = parm1;
    response = MongoLibrary.validateId(projectId);
    if (!response.success) return response;
    const projectIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this project
    let securityObject = {};
    securityObject.collectionName = 'projects';
    securityObject.method = 'updateProjectById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['projectId'] = projectId;
    securityObject['projectIdObj'] = projectIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    projectDocument.lastModifiedDate = new Date();

    response = await ProjectModel.updateProjectById(projectIdObj, projectDocument)
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
      let result = await this.getProjectById({ "requestorId": requestorId, "projectId": projectId });
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  //TODO have to update user by removing project
  static async deleteProjectById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const projectId = parm1;
    response = MongoLibrary.validateId(projectId);
    if (!response.success) return response;
    const projectIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this project
    let securityObject = {};
    securityObject.collectionName = 'projects';
    securityObject.method = 'deleteProjectById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['projectId'] = projectId;
    securityObject['projectIdObj'] = projectIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await ProjectModel.deleteProjectById(projectIdObj)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.numRecs = 0;
        response.message = err.message;
        return response;
      });

      //TODO delete project from users

    return response;

  }

};

module.exports = ProjectController;

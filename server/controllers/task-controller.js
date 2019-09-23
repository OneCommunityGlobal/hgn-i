const Controller = require('./controller');
const TaskModel = require('../models/task-model');
const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');

class TaskController extends Controller {

  static async createTask({ requestorId=null, document=null, ...rest }) {
    const options = {};
    const taskId = null;
    var response = {};
    var taskDocument = document;
    const assignedToId = taskDocument.assignedToId;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;
    response = MongoLibrary.validateId(assignedToId);
    if (!response.success) return response;
    const assignedToIdObj = response.data;

    response = await MongoLibrary.checkRecordExistsById('users', assignedToIdObj);
    if(!response.success) return response;
    taskDocument.assignedToId = assignedToIdObj;

    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'createTask';
    securityObject.dbMethod = 'insertOne';
    securityObject.requestorId = requestorId;
    securityObject.assignedToId = assignedToId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    taskDocument.createdDate = new Date();
    taskDocument.lastModifiedDate = new Date();

    response = await TaskModel.createTask(taskDocument)
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

  static async getTaskById({ parm1 = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;

    const taskId = parm1;
    response = MongoLibrary.validateId(taskId);
    if (!response.success) return response;
    const taskIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'getTaskById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['taskId'] = taskId;
    securityObject['taskIdObj'] = taskIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TaskModel.getTaskById(taskIdObj, options)
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

  //TODO This routine returns all tasks so need to determine the security for this.
  static async getTasks({ requestorId = null, project = {}, query = null, ...rest }) {

    const options = {};
    options.project = project;
    var response = {};

    //Because this returns all tasks, the call should not provide a taskId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'getTasks';
    securityObject.dbMethod = 'findMany';
    securityObject.query = query;
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    query = {};
    response = await TaskModel.getTasks(query, options)
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

  //Can specify begDate and/or endDate in options
  static async getTasksByUserId({ requestorId = null, userId = null, project = {}, options = {}, ...rest }) {

    options.project = project;
    var response = {};

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;
    response = MongoLibrary.validateId(userId);
    if (!response.success) return response;
    const userIdObj = response.data;

    var begDateObj, endDateObj, query = {};

    if (options.begDate) {
      let begDate = options.begDate;
      response = await DateLibrary.validateDate(begDate, options);
      if (!response.success) return response;
      response = DateLibrary.convertStringDateToDate(begDate, options);
      if (!response.success) return response;
      begDateObj = response.data;
    }else {
      begDateObj = new Date(2000, 1, 1)
    }
    if (options.endDate) {
      let endDate = options.endDate;
      response = await DateLibrary.validateDate(endDate, options);
      if (!response.success) return response;
      response = DateLibrary.convertStringDateToDate(endDate, options);
      if (!response.success) return response;
      endDateObj = response.data;
    }else {
      endDateObj = new Date(2999, 12, 31)
    }

    var query =  {
      "createdDate": {$gte:begDateObj, $lte:endDateObj},
      "userId": userIdObj
    }
    
    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'getTasksByUserId';
    securityObject.dbMethod = 'findMany';
    securityObject.query = query;
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TimesheetModel.getTasksByUserId(query, options)
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

  static async updateTaskById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {
      
    const options = {};
    var response = {};
    var taskDocument = document;

    const taskId = parm1;
    response = MongoLibrary.validateId(taskId);
    if (!response.success) return response;
    const taskIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'updateTaskById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['taskId'] = taskId;
    securityObject['taskIdObj'] = taskIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    taskDocument.lastModifiedDate = new Date();

    response = await TaskModel.updateTaskById(taskIdObj, taskDocument)
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
      let result = await this.getTaskById({"requestorId": requestorId, "taskId": taskId});
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  static async deleteTaskById({ parm1 = null, requestorId = null, ...rest}) {
    const options = {};
    var response = {};

    const taskId = parm1;
    response = MongoLibrary.validateId(taskId);
    if (!response.success) return response;
    const taskIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this task
    let securityObject = {};
    securityObject.collectionName = 'tasks';
    securityObject.method = 'deleteTaskById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['taskId'] = taskId;
    securityObject['taskIdObj'] = taskIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await TaskModel.deleteTaskById(taskIdObj)
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

module.exports = TaskController;

const Controller = require('./controller');
const TimesheetModel = require('../models/timesheet-model');
const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');
const DateLibrary = require('../libraries/date-library');

class TimesheetController extends Controller {
  constructor() {
    super();
  }

  static async createTimesheet({ requestorId = null, document = null, ...rest }) {
    const options = {};
    const timesheetId = null;
    var timesheetDocument = document;
    var response = {};
    const userId = requestorId;
    const projectId = timesheetDocument.projectId;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;
    const userIdObj = requestorIdObj;
    response = MongoLibrary.validateId(projectId);
    if (!response.success) return response;
    const projectIdObj = response.data;

    response = await MongoLibrary.checkRecordExistsById('users', userIdObj);
    if (!response.success) return response;
    timesheetDocument.userId = userIdObj;
    response = await MongoLibrary.checkRecordExistsById('projects', projectIdObj);
    if (!response.success) return response

    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'createTimesheet';
    securityObject.dbMethod = 'insertOne';
    securityObject.userId = userId;
    securityObject.projectId = projectId;
    securityObject.requestorId = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    //Make any changes/fixes before submitting document.
    //Determine which date(s) to use then validate
    //Can be dateOfWork and hours or begDateTime and endDateTime or either beg or end plus hours
    //So derive actual date and times based on what is provided
    var dateOfWork = timesheetDocument.dateOfWork;
    var begDateTime = timesheetDocument.begDateTime;
    var endDateTime = timesheetDocument.endDateTime;
    var totalMinutes = timesheetDocument.totalMinutes;

    //TODO code for instances where the minutes is derived from the beg and end datetimes
    // or if begtime is specified with minutes, derive the end time etc...?
    if (typeof dateOfWork !== 'undefined' && dateOfWork) {
      //If dateOfWork is specified, totalMinutes must also be greater than 0
      if (!totalMinutes > 0) {
        response.success = false;
        response.message = "No Timesheet Added - totalMinutes Must Be > 0";
        return response;
      }
      response = await DateLibrary.validateDate(dateOfWork, options);
      if (!response.success) return response;
      response = DateLibrary.convertStringDateToDate(dateOfWork, options);
      if (!response.success) return response;
      timesheetDocument.dateOfWork = response.data;
      delete timesheetDocument.begDateTime;
      delete timesheetDocument.endDateTime;
      //TODO give different options for entering timesheet info?
    } else if (typeof begDateTime !== 'undefined' && begDateTime) {
      timesheetDocument.begDateTime = DateLibrary.convertStringDateToDate(begDateTime, options);
      timesheetDocument.endDateTime = DateLibrary.convertStringDateToDate(endDateTime, options);
    } else if (typeof endDateTime !== 'undefined' && endDateTime) {
      timesheetDocument.begDateTime = DateLibrary.convertStringDateToDate(begDateTime, options);
      timesheetDocument.endDateTime = DateLibrary.convertStringDateToDate(endDateTime, options);
    } else { //No valid date or datetimes so can't determine work date and hours worked
      //return error
    }

    timesheetDocument.projectId = projectIdObj;
    timesheetDocument.createdDate = new Date();
    timesheetDocument.lastModifiedDate = new Date();

    response = await TimesheetModel.createTimesheet(timesheetDocument)
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

  static async getTimesheetById({ parm1 = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;

    const timesheetId = parm1;
    response = MongoLibrary.validateId(timesheetId);
    if (!response.success) return response;
    const timesheetIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'getTimesheetById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['timesheetId'] = timesheetId;
    securityObject['timesheetIdObj'] = timesheetIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TimesheetModel.getTimesheetById(timesheetIdObj, options)
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

  //TODO This routine returns many timesheets so need to determine the security for this.
  //Can specify begDate and/or endDate in options
  static async getTimesheetsByUserId({ requestorId = null, userId = null, project = {}, options = {}, ...rest }) {

    options.project = project;
    var response = {};

    //Because this returns all timesheets, the call should not provide a timesheetId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;
    response = MongoLibrary.validateId(userId);
    if (!response.success) return response;
    const userIdObj = response.data;

    //TODO validate user with userId exists?

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
      "dateOfWork": {$gte:begDateObj, $lte:endDateObj},
      "userId": userIdObj
    }
    
    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'getTimesheetsByUserId';
    securityObject.dbMethod = 'findMany';
    securityObject.query = query;
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TimesheetModel.getTimesheetsByUserId(query, options)
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

  //TODO This routine returns many timesheets so need to determine the security for this.
  //TODO Can specify restricting options such as teamId or projectId?
  static async getTimesheetsByDate({ requestorId = null, begDate = null, endDate = null, project = {}, options = {}, ...rest }) {

    options.project = project;
    var response = {};

    //Because this returns all timesheets, the call should not provide a timesheetId, but does need a requestorId
    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'getTimesheetsByDate';
    securityObject.dbMethod = 'findMany';
    securityObject.query = query;
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    var begDateObj, endDateObj, query = {};

    if (begDate) {
      response = await DateLibrary.validateDate(begDate, options);
      if (!response.success) return response;
      response = DateLibrary.convertStringDateToDate(begDate, options);
      if (!response.success) return response;
      begDateObj = response.data;
    }else {
      begDateObj = new Date(2000, 1, 1)
    }
    if (endDate) {
      response = await DateLibrary.validateDate(endDate, options);
      if (!response.success) return response;
      response = DateLibrary.convertStringDateToDate(endDate, options);
      if (!response.success) return response;
      endDateObj = response.data;
    }else {
      endDateObj = new Date(2999, 12, 31)
    }

    var query =  {
      "dateOfWork": {$gte:begDateObj, $lte:endDateObj}
    }
    
    response = await TimesheetModel.getTimesheetsByDate(query, options)
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

  static async updateTimesheetById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {

    const options = {};
    var response = {};
    var timesheetDocument = document;

    const timesheetId = parm1;
    response = MongoLibrary.validateId(timesheetId);
    if (!response.success) return response;
    const timesheetIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'updateTimesheetById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['timesheetId'] = timesheetId;
    securityObject['timesheetIdObj'] = timesheetIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    timesheetDocument.lastModifiedDate = new Date();

    response = await TimesheetModel.updateTimesheetById(timesheetIdObj, timesheetDocument)
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
      let result = await this.getTimesheetById({ "requestorId": requestorId, "timesheetId": timesheetId });
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  static async deleteTimesheetById({ parm1 = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    const timesheetId = parm1;
    response = MongoLibrary.validateId(timesheetId);
    if (!response.success) return response;
    const timesheetIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this timesheet
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'deleteTimesheetById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['timesheetId'] = timesheetId;
    securityObject['timesheetIdObj'] = timesheetIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await TimesheetModel.deleteTimesheetById(timesheetIdObj)
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

  static async getLeaderboardData({ startDate = null, endDate = null, requestorId = null, ...rest }) {
    const options = {};
    var response = {};

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'getLeaderboardData';
    securityObject.dbMethod = 'findByAggregate';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TimesheetModel.getLeaderboardData(startDate, endDate)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.message = err.message;
        return response;
      });

    return response;
  }

  static async getLeaderboardDataByUsersTeams({ startDate = null, endDate = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this user
    let securityObject = {};
    securityObject.collectionName = 'timesheets';
    securityObject.method = 'getLeaderboardDataByUsersTeams';
    securityObject.dbMethod = 'findByAggregate';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await TimesheetModel.getLeaderboardDataByUsersTeams(startDate, endDate)
      //this catch will catch any promise errors bubbling up from lower routines
      .catch((err) => {
        response.success = false;
        response.data = null;
        response.message = err.message;
        return response;
      });

    return response;
  }

}

module.exports = TimesheetController;

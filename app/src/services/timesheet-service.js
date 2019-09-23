import HTTPService from "./http-service";
// import config from "../config/config.json";

class TimesheetService {
  static async createTimesheet(requestorId, timesheetDoc) {
    const controller = "timesheet";
    const controllerMethod = "createTimesheet";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = timesheetDoc;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getTimesheetById(requestorId, timesheetId) {
    const controller = "timesheet";
    const controllerMethod = "getTimesheetById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + timesheetId;

    const postData = {};
    postData.requestorId = requestorId;
    //This is a mongodb project (you can choose what fields to return):
    postData.project = {"_id":1, "name":1, "isActive":1, "users":1};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getTimesheetsByUserId(requestorId, userId) {
    const controller = "timesheet";
    const controllerMethod = "getTimesheetsByUserId";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + userId;

    const postData = {};
    postData.requestorId = requestorId;
    //This is a mongodb project (you can choose what fields to return):
    postData.project = {};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getTimesheetsByDate(requestorId, begDate, endDate) {
    const controller = "timesheet";
    const controllerMethod = "getTimesheetsByDate";
    const urlPath = "/" + controller + "/" + controllerMethod;

    const postData = {
      begDate: "2019-01-01",
      endDate: "2019-12-31"
    };
    postData.requestorId = requestorId;
    //This is a mongodb project (you can choose what fields to return):
    postData.project = {"_id":1, "name":1, "isActive":1, "users":1};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async updateTimesheetById(requestorId, timesheetId, timesheetData) {
    const controller = "timesheet";
    const controllerMethod = "updateTimesheetById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + timesheetId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = timesheetData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async deleteTimesheetById(requestorId, timesheetId) {
    const controller = "timesheet";
    const controllerMethod = "deleteTimesheetById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + timesheetId;

    const postData = {};
    postData.requestorId = requestorId;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getLeaderboardData(requestorId, parms) {
    const controller = "timesheet";
    const controllerMethod = "getLeaderboardData";
    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    let postData = {};
    postData.requestorId = requestorId;
    postData = {requestorId, ...parms};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getLeaderboardDataByUsersTeams(requestorId, parms) {
    const controller = "timesheet";
    const controllerMethod = "getLeaderboardDataByUsersTeams";
    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    let postData = {};
    postData.requestorId = requestorId;
    postData = {requestorId, ...parms};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

}

export default TimesheetService;

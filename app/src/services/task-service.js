import HTTPService from "./http-service";
// import config from "../config/config.json";

class TaskService {

  static async createTask(requestorId, taskDoc) {
    const controller = "task";
    const controllerMethod = "createTask";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = taskDoc;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getTaskById(requestorId, taskId) {
    const controller = "task";
    const controllerMethod = "getTaskById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + taskId;

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

  static async getTasks(requestorId) {
    const controller = "task";
    const controllerMethod = "getTasks";
    const urlPath = "/" + controller + "/" + controllerMethod;

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

  static async updateTaskById(requestorId, taskId, taskData) {
    const controller = "task";
    const controllerMethod = "updateTaskById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + taskId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = taskData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async deleteTaskById(requestorId, taskId) {
    const controller = "task";
    const controllerMethod = "deleteTaskById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + taskId;

    const postData = {};
    postData.requestorId = requestorId;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }
}

export default TaskService;
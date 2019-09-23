import HTTPService from "./http-service";
// import config from "../config/config.json";

class ProjectService {

  static async createProject(requestorId, projectDoc) {
    const controller = "project";
    const controllerMethod = "createProject";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = projectDoc;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getProjectById(requestorId, projectId) {
    const controller = "project";
    const controllerMethod = "getProjectById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + projectId;

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

  static async getProjects(requestorId) {
    const controller = "project";
    const controllerMethod = "getProjects";
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

  static async updateProjectById(requestorId, projectId, projectData) {
    const controller = "project";
    const controllerMethod = "updateProjectById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + projectId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = projectData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async deleteProjectById(requestorId, projectId) {
    const controller = "project";
    const controllerMethod = "deleteProjectById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + projectId;

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

export default ProjectService;
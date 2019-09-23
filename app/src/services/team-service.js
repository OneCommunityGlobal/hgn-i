import HTTPService from "./http-service";
// import config from "../config/config.json";

class TeamService {

  static async createTeam(requestorId, teamDoc) {
    const controller = "team";
    const controllerMethod = "createTeam";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = teamDoc;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getTeamById(requestorId, teamId) {
    const controller = "team";
    const controllerMethod = "getTeamById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + teamId;

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

  static async getTeams(requestorId) {
    const controller = "team";
    const controllerMethod = "getTeams";
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

  static async updateTeamById(requestorId, teamId, teamData) {
    const controller = "team";
    const controllerMethod = "updateTeamById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + teamId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = teamData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async deleteTeamById(requestorId, teamId) {
    const controller = "team";
    const controllerMethod = "deleteTeamById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + teamId;

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

export default TeamService;
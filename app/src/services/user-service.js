import HTTPService from "./http-service";
// import config from "../config/config.json";

class UserService {
  static async login(credentials) {
    const controller = "user";
    const controllerMethod = "getUserByLogin";
    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    let postData = credentials;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getUserById(requestorId, userId) {
    const controller = "user";
    const controllerMethod = "getUserById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + userId;

    const postData = {};
    postData.requestorId = requestorId;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getUsers(requestorId) {
    const controller = "user";
    const controllerMethod = "getUsers";
    const urlPath = "/" + controller + "/" + controllerMethod;

    const postData = {};
    postData.requestorId = requestorId;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async createUser(requestorId, userDoc) {
    const controller = "user";
    const controllerMethod = "createUser";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async updateUser(requestorId, userData) {
    const controller = "user";
    const controllerMethod = "updateUserById";

    const userDoc = {};
    userDoc.data = userData.data;
    userDoc.requestorId = userData.data._id;
    userDoc.userId = userData.targetUserId;

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.parms = userData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }
}

export default UserService;
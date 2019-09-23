import HTTPService from "./http-service";
// import config from "../config/config.json";

class MessageService {

  static async createMessage(requestorId, messageDoc) {
    const controller = "message";
    const controllerMethod = "createMessage";

    const urlPath = "/" + controller + "/" + controllerMethod + "/";

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = messageDoc;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async getMessageById(requestorId, messageId) {
    const controller = "message";
    const controllerMethod = "getMessageById";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + messageId;

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

  static async getMessagesBySenderId(requestorId, senderId) {
    const controller = "message";
    const controllerMethod = "getMessagesBySenderId";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + senderId;

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

  static async getMessagesByReceiverId(requestorId, receiverId) {
    const controller = "message";
    const controllerMethod = "getMessagesByReceiverId";
    const urlPath = "/" + controller + "/" + controllerMethod + "/" + receiverId;

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

  static async updateMessageById(requestorId, messageId, messageData) {
    const controller = "message";
    const controllerMethod = "updateMessageById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + messageId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.document = messageData;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }

  static async deleteMessageById(requestorId, messageId) {
    const controller = "message";
    const controllerMethod = "deleteMessageById";

    const urlPath = "/" + controller + "/" + controllerMethod + "/" + messageId;

    const postData = {};
    postData.requestorId = requestorId;
    postData.messageId = messageId;

    let response = await HTTPService.makeAjaxRequest(urlPath, postData)
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  }
}

export default MessageService;
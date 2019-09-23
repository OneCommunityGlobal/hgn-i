const Controller = require('./controller');
const MessageModel = require('../models/message-model');
const MongoLibrary = require('../libraries/mongo-library');
const SecurityLibrary = require('../libraries/security-library');

class MessageController extends Controller {

  static async createMessage({ requestorId=null, document=null, ...rest }) {
    const options = {};
    const messageId = null;
    var response = {};
    const senderId = requestorId;
    var messageDocument = document;
    const receiverId = messageDocument.receiverId;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;
    const senderIdObj = requestorIdObj;
    response = MongoLibrary.validateId(receiverId);
    if (!response.success) return response;
    const receiverIdObj = response.data;

    response = await MongoLibrary.checkRecordExistsById('users', receiverIdObj);
    if(!response.success) return response;

    messageDocument.receiverId = receiverIdObj;
    messageDocument.senderId = senderIdObj;
    messageDocument.createdDate = new Date();
    messageDocument.lastModifiedDate = new Date();

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'createMessage';
    securityObject.dbMethod = 'insertOne';
    securityObject.senderId = senderId;
    securityObject.receiverId = receiverId;
    securityObject.requestorId = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await MessageModel.createMessage(messageDocument)
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

  static async getMessageById({ parm1 = null, requestorId = null, project = {}, ...rest }) {
    const options = {};
    var response = {};

    options.project = project;

    const messageId = parm1;
    response = MongoLibrary.validateId(messageId);
    if (!response.success) return response;
    const messageIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'getMessageById';
    securityObject.dbMethod = 'findOne';
    securityObject['requestorId'] = requestorId;
    securityObject['messageId'] = messageId;
    securityObject['messageIdObj'] = messageIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await MessageModel.getMessageById(messageIdObj, options)
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

  static async getMessages({ parm1 = null, requestorId = null, options = {}, ...rest }) {
    var response = {};

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'getMessages';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await MessageModel.getMessagess(requestorIdObj, options)
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

  static async getMessagesBySenderId({ parm1 = null, requestorId = null, options = {}, ...rest }) {
    var response = {};

    const senderId = parm1;
    response = MongoLibrary.validateId(senderId);
    if (!response.success) return response;
    const senderIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'getMessagesBySenderId';
    securityObject.dbMethod = 'findMany';
    securityObject['senderId'] = senderId;
    securityObject['senderIdObj'] = senderIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await MessageModel.getMessagesBySenderId(senderIdObj, options)
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

  static async getMessagesByReceiverId({ parm1 = null, requestorId = null, options = {}, ...rest }) {
    var response = {};

    const receiverId = parm1;
    response = MongoLibrary.validateId(receiverId);
    if (!response.success) return response;
    const receiverIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'getMessageByReceiverId';
    securityObject.dbMethod = 'findMany';
    securityObject['requestorId'] = requestorId;
    securityObject['receiverId'] = receiverId;
    securityObject['receiverIdObj'] = receiverIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    response = await MessageModel.getMessagesByReceiverId(receiverIdObj, options)
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

  static async updateMessageById({ parm1 = null, requestorId = null,
    document = {}, ...rest }) {
      
    const options = {};
    var response = {};
    var messageDocument = document;

    const messageId = parm1;
    response = MongoLibrary.validateId(messageId);
    if (!response.success) return response;
    const messageIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'updateMessageById';
    securityObject.dbMethod = 'updateOne';
    securityObject['requestorId'] = requestorId;
    securityObject['messageId'] = messageId;
    securityObject['messageIdObj'] = messageIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return response;

    messageDocument.lastModifiedDate = new Date();

    response = await MessageModel.updateMessageById(messageIdObj, messageDocument)
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
      let result = await this.getMessageById({"requestorId": requestorId, "messageId": messageId});
      if (result.success) {
        response.data = result.data;
      }
    }

    return response;
  }

  static async deleteMessageById({ parm1 = null, requestorId = null, ...rest}) {
    const options = {};
    var response = {};

    const messageId = parm1;
    response = MongoLibrary.validateId(messageId);
    if (!response.success) return response;
    const messageIdObj = response.data;

    response = MongoLibrary.validateId(requestorId);
    if (!response.success) return response;
    const requestorIdObj = response.data;

    //Validate security for this message
    let securityObject = {};
    securityObject.collectionName = 'messages';
    securityObject.method = 'deleteMessageById';
    securityObject.dbMethod = 'deleteOne';
    securityObject['requestorId'] = requestorId;
    securityObject['messageId'] = messageId;
    securityObject['messageIdObj'] = messageIdObj;
    response = await SecurityLibrary.validateRequestorSecurity(requestorIdObj, securityObject);
    if (!response.success) return (response);

    response = await MessageModel.deleteMessageById(messageIdObj)
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

module.exports = MessageController;

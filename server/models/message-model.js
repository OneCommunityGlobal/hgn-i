const Model = require('./model');

class MessageModel extends Model {

  static async createMessage(messageDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('messages', 'message-schema', messageDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('messages', messageDocument, options);
    return response;
  }

  static async getMessageById(messageIdObj, options = {}) {
    var query = { "_id": messageIdObj };

    return await this.findOne('messages', query, options);
  }

  //TODO this was cut & paste so needs to be completed. Need to do a union of requestors sent and recieved
  static async getMessages(requestorIdObj, options = {}) {
    var matchPipe = {};

    if (options.status === 'read') {
      matchPipe = {
        $match:
        {
          'receiverId': requestorIdObj,
          'isRead': true
        }
      }
    } else if (options.status === 'unread') {
      matchPipe = {
        $match:
        {
          'receiverId': requestorIdObj,
          'isRead': false
        }
      }
    } else {
      matchPipe = {
        $match:
        {
          'receiverId': requestorIdObj,
        }
      }
    }

    const pipeline = [
      matchPipe,
      {
        '$lookup':
        {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        '$project': {
          _id: 1,
          subject: 1,
          isRead: 1,
          createdDate: 1,
          receiverId: 1,
          senderId: 1,
          senderFirstName: { $arrayElemAt: ['$sender.firstName', 0] },
          senderLastName: { $arrayElemAt: ['$sender.lastName', 0] },
        }
      },
    ]

    return await this.findByAggregate('messages', pipeline, options)

  }

  //TODO this was cut and paste from ByRecieverID so needs to be fixed a little
  static async getMessagesBySenderId(senderIdObj, options = {}) {
    var matchPipe = {};

    if (options.status === 'read') {
      matchPipe = {
        $match:
        {
          'senderId': senderIdObj,
          'isRead': true
        }
      }
    } else if (options.status === 'unread') {
      matchPipe = {
        $match:
        {
          'senderId': senderIdObj,
          'isRead': false
        }
      }
    } else {
      matchPipe = {
        $match:
        {
          'senderId': senderIdObj,
        }
      }
    }

    const pipeline = [
      matchPipe,
      {
        '$lookup':
        {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        '$project': {
          _id: 1,
          subject: 1,
          isRead: 1,
          createdDate: 1,
          receiverId: 1,
          senderId: 1,
          senderFirstName: { $arrayElemAt: ['$sender.firstName', 0] },
          senderLastName: { $arrayElemAt: ['$sender.lastName', 0] },
        }
      },
    ]

    return await this.findByAggregate('messages', pipeline, options)
  }

  static async getMessagesByReceiverId(receiverIdObj, options = {}) {
    var matchPipe = {};

    if (options.status === 'read') {
      matchPipe = {
        $match:
        {
          'receiverId': receiverIdObj,
          'isRead': true
        }
      }
    } else if (options.status === 'unread') {
      matchPipe = {
        $match:
        {
          'receiverId': receiverIdObj,
          'isRead': false
        }
      }
    } else {
      matchPipe = {
        $match:
        {
          'receiverId': receiverIdObj,
        }
      }
    }

    const pipeline = [
      matchPipe,
      {
        '$lookup':
        {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        '$project': {
          _id: 1,
          subject: 1,
          isRead: 1,
          createdDate: 1,
          receiverId: 1,
          senderId: 1,
          senderFirstName: { $arrayElemAt: ['$sender.firstName', 0] },
          senderLastName: { $arrayElemAt: ['$sender.lastName', 0] },
        }
      },
    ]

    return await this.findByAggregate('messages', pipeline, options)

  }

  static async updateMessageById(messageIdObj, messageDocument) {
    const options = {};
    const collectionName = 'messages';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('messages', 'message-schema', messageDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": messageIdObj };
    const updateDoc = this.convertDocToUpdate(messageDocument);

    return await this.updateOne('messages', query, updateDoc, options);
  }

  static async deleteMessageById(messageIdObj) {
    const options = {};
    const query = { "_id": messageIdObj };

    //TODO validate query?

    return await this.deleteOne('messages', query, options);
  }

}

module.exports = MessageModel;
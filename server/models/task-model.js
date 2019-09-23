const Model = require('./model');

class TaskModel extends Model {

  static async createTask(taskDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('tasks', 'task-schema', taskDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('tasks', taskDocument, options);
    return response;
  }

  static async getTaskById(taskIdObj, options = {}) {
    var query = { "_id": taskIdObj };

    return await this.findOne('tasks', query, options);
  }

  static async getTasks(query = null, options) {
    const collectionName = 'tasks';

    const pipeline = [
      {
        '$lookup':
        {
          from: 'users',
          localField: 'assignedToId',
          foreignField: '_id',
          as: 'assigned'
        }
      },
      {
        '$project': {
          name: 1,
          description: 1,
          isActive: 1,
          isComplete: 1,
          assignedToId: { $arrayElemAt: ['$assigned._id', 0] },
          assignedToFirstName: { $arrayElemAt: ['$assigned.firstName', 0] },
          assignedToLastName: { $arrayElemAt: ['$assigned.lastName', 0] },
        }
      }
    ]

    return await this.findByAggregate(collectionName, pipeline, options)
  }

  static async getTasksByUserId(query = null, options) {
    const collectionName = 'tasks';

    //TODO validate query?

    return await Model.findMany(collectionName, query, options);
  }

  static async updateTaskById(taskIdObj, taskDocument) {
    const options = {};
    const collectionName = 'tasks';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('tasks', 'task-schema', taskDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": taskIdObj };
    const updateDoc = this.convertDocToUpdate(taskDocument);

    return await this.updateOne('tasks', query, updateDoc, options);
  }

  static async deleteTaskById(taskIdObj) {
    const options = {};
    const query = { "_id": taskIdObj };

    //TODO validate query?

    return await this.deleteOne('tasks', query, options);
  }

}

module.exports = TaskModel;
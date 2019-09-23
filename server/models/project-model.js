const Model = require('./model');

class ProjectModel extends Model {

  static async createProject(projectDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('projects', 'project-schema', projectDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('projects', projectDocument, options);
    return response;
  }

  static async getProjectById(projectIdObj, options = {}) {
    var options = {};

    const pipeline = [
      {
        $match:
        {
          '_id': projectIdObj
        }
      },
      {
        '$lookup':
        {
          from: 'users',
          localField: '_id',
          foreignField: 'projects.id',
          as: 'members'
        }
      },
      {
        '$project': {
          name: 1,
          isActive: 1,
          "members._id": 1,
          "members.firstName": 1,
          "members.lastName": 1,
        }
      },
    ]

    return await this.findByAggregate('projects', pipeline, options)
  }

  static async getProjects(options) {
    const collectionName = 'projects';

    const pipeline = [
      {
        '$lookup':
        {
          from: 'users',
          localField: '_id',
          foreignField: 'projects.id',
          as: 'members'
        }
      },
      {
        '$project': {
          name: 1,
          isActive: 1,
          "members._id": 1,
          "members.firstName": 1,
          "members.lastName": 1,
        }
      }
    ]

    return await this.findByAggregate('projects', pipeline, options)
  }

  static async updateProjectById(projectIdObj, projectDocument) {
    const options = {};
    const collectionName = 'projects';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('projects', 'project-schema', projectDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": projectIdObj };
    const updateDoc = this.convertDocToUpdate(projectDocument);

    return await this.updateOne('projects', query, updateDoc, options);
  }

  static async deleteProjectById(projectIdObj) {
    const options = {};
    const query = { "_id": projectIdObj };

    //TODO validate query?

    return await this.deleteOne('projects', query, options);
  }

}

module.exports = ProjectModel;
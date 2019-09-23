const Model = require('./model');

class TeamModel extends Model {

  static async createTeam(teamDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('teams', 'team-schema', teamDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('teams', teamDocument, options);
    return response;
  }

  static async getTeamById(teamIdObj, options = {}) {
    var options = {};

    const pipeline = [
      {
        $match:
        {
          '_id': teamIdObj
        }
      },
      {
        '$lookup':
        {
          from: 'users',
          localField: '_id',
          foreignField: 'teams.id',
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

    return await this.findByAggregate('teams', pipeline, options)
  }

  static async getTeams(options) {
    const collectionName = 'projects';

    const pipeline = [
      {
        '$lookup':
        {
          from: 'users',
          localField: '_id',
          foreignField: 'teams.id',
          as: 'members'
        }
      },
      {
        '$lookup':
        {
          from: 'users',
          localField: 'managerId',
          foreignField: '_id',
          as: 'manager'
        }
      },
      {
        '$project': {
          name: 1,
          isActive: 1,
          "members._id": 1,
          "members.firstName": 1,
          "members.lastName": 1,
          managerId: 1,
          managerFirstName: { $arrayElemAt: ['$manager.firstName', 0] },
          managerLastName: { $arrayElemAt: ['$manager.lastName', 0] },
        }
      }
    ]

    return await this.findByAggregate('teams', pipeline, options)
  }

  static async updateTeamById(teamIdObj, teamDocument) {
    const options = {};
    const collectionName = 'teams';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('teams', 'team-schema', teamDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": teamIdObj };
    const updateDoc = this.convertDocToUpdate(teamDocument);

    return await this.updateOne('teams', query, updateDoc, options);
  }

  //TODO have to update users by deleting team
  static async deleteTeamById(teamIdObj) {
    const options = {};
    const query = { "_id": teamIdObj };

    //TODO validate query?

    return await this.deleteOne('teams', query, options);
  }

}

module.exports = TeamModel;
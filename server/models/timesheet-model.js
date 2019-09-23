const Model = require('./model');

class TimesheetModel extends Model {

  static async createTimesheet(timesheetDocument, options = {}) {
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "insertOne";
    validateOptions.level = "document";

    response = await this.validateDocument('timesheets', 'timesheet-schema', timesheetDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    response = await this.insertOne('timesheets', timesheetDocument, options);
    return response;
  }

  static async getTimesheetById(timesheetIdObj, options = {}) {
    var query = { "_id": timesheetIdObj };

    return await this.findOne('timesheets', query, options);
  }

  static async getTimesheetsByUserId(query = null, options) {
    const collectionName = 'timesheets';

    //TODO validate query?

    return await Model.findMany(collectionName, query, options);
  }

  static async getTimesheetsByDate(query = null, options) {
    const collectionName = 'timesheets';

    //TODO validate query?

    return await Model.findMany(collectionName, query, options);
  }

  static async updateTimesheetById(timesheetIdObj, timesheetDocument) {
    const options = {};
    const collectionName = 'timesheets';
    var response = {};

    //Validate the document before updating
    const validateOptions = {};
    validateOptions.dbMethod = "updateOne";
    validateOptions.level = "fields";

    response = await this.validateDocument('timesheets', 'timesheet-schema', timesheetDocument, validateOptions);
    if (!response.success) {
      return response;
    }

    const query = { "_id": timesheetIdObj };
    const updateDoc = this.convertDocToUpdate(timesheetDocument);

    return await this.updateOne('timesheets', query, updateDoc, options);
  }

  static async deleteTimesheetById(timesheetIdObj) {
    const options = {};
    const query = { "_id": timesheetIdObj };

    //TODO validate query?

    return await this.deleteOne('timesheets', query, options);
  }

  static async getLeaderboardData(startDate, endDate) {
    var response = {};
    const collectionName = 'timesheets';
    const query = null;
    const options = {};

    //some examples of how to create variations of pipe segments and include them later
    const matchAll = {
      '$match': {
        'dateOfWork': {
          '$gte': new Date(startDate),
          '$lte': new Date(endDate)
        }
      }
    };

    //Can do a match by users pipe instead of date range:
    // const matchByUser = {
    //   '$match': {
    //     'userId': userIdObj,
    //     'dateOfWork': {
    //       '$gte': new Date(startDate),
    //       '$lte': new Date(endDate)
    //     }
    //   }
    // };

    //use a statement like below to choose which pipe to use. Hardcoded matchAll for now
    // const matchPipe = userIdObj ? matchByUser : matchAll;
    const matchPipe = matchAll;


    //TODO does not currently select by teams user is on
    let pipeline = [
      matchPipe,
      {
        '$addFields': {
          tangibleTime: {
            $cond: [{
              $eq: ['$isTangible', true],
            }, '$totalMinutes', 0],
          },
          intangibleTime: {
            $cond: [{
              $eq: ['$isTangible', false],
            }, '$totalMinutes', 0],
          },
        }
      },
      {
        '$group': {
          '_id': {
            'uid': '$userId',
          },
          totalMinutes: { $sum: '$totalMinutes' },
          tangibleTime: { $sum: '$tangibleTime' },
          intangibleTime: { $sum: '$intangibleTime' },
        }
      },
      {
        '$lookup': {
          'from': 'users',
          'localField': '_id.uid',
          'foreignField': '_id',
          'as': 'user'
        }
      },
      {
        '$project': {
          '_id': 0,
          '_id': {
            '$toString': '$_id.uid'
          },
          firstName: { $arrayElemAt: ['$user.firstName', 0] },
          lastName: { $arrayElemAt: ['$user.lastName', 0] },
          teams: "$user.teams",
          totalMinutes: "$totalMinutes",
          weeklyComittedHours: { $arrayElemAt: ['$user.weeklyComittedHours', 0] },
          tangibleTime: '$tangibleTime',
          intangibleTime: '$intangibleTime',
          totaltime_hrs: {
            $divide: ['$totalMinutes', 60],
          },
          totaltangibletime_hrs: {
            $divide: ['$tangibleTime', 60],
          },
          totalintangibletime_hrs: {
            $divide: ['$intangibleTime', 60],
          },
          percentagespentintangible: {
            $cond: [{
              $eq: ['$totalMinutes', 0],
            }, 0, {
              $multiply: [{
                $divide: ['$tangibleTime', '$totalMinutes'],
              }, 100],
            }],
          },
        }
      },
      {
        $unwind:
        {
          path: "$teams",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $sort: {
          totaltangibletime_hrs: -1,
          name: 1,
        },
      },
    ];


    response = await Model.findByAggregate(collectionName, pipeline, options);

    return response;
  }

  static async getLeaderboardDataByUsersTeams(userIdObj, startDate, endDate) {
    var response = {};
    const collectionName = 'users';
    const query = null;
    const options = {};

    let pipeline = [
      {
        '$match': {
          '_id': userIdObj,
        }
      },
      {
        '$unwind': {
          'path': '$teams',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$lookup': {
          'from': 'teams',
          'localField': 'teams',
          'foreignField': '_id',
          'as': 'team'
        }
      },
      {
        '$project': {
          '_id': 0,
          'uid': '$_id',
          'fn': '$firstName',
          'ln': '$lastName',
          'wch': '$weeklyComittedHours',
          'team': {
            '$arrayElemAt': [
              '$team', 0
            ]
          }
        }
      },
      {
        '$unwind': {
          'path': '$team.users',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$project': {
          'tu': '$team.users'
        }
      },
      {
        '$group': {
          '_id': {
            'tu': '$tu'
          }
        }
      },
      {
        '$project': {
          '_id': 0,
          'uid': '$_id.tu'
        }
      },
      {
        '$lookup': {
          'from': 'users',
          'localField': 'uid',
          'foreignField': '_id',
          'as': 'user'
        }
      },
      {
        '$lookup': {
          'from': 'timesheets',
          'localField': 'uid',
          'foreignField': 'userId',
          'as': 'ts'
        }
      },
      {
        '$unwind': {
          'path': '$ts',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$project': {
          'userId': '$uid',
          'firstName': {
            '$arrayElemAt': [
              '$user.firstName', 0
            ]
          },
          'lastName': {
            '$arrayElemAt': [
              '$user.lastName', 0
            ]
          },
          'weeklyComittedHours': {
            '$arrayElemAt': [
              '$user.weeklyComittedHours', 0
            ]
          },
          'isTangible': '$ts.isTangible',
          'dateOfWork': '$ts.dateOfWork',
          'totalMinutes': '$ts.totalMinutes'
        }
      },
      {
        '$addFields': {
          tangibleTime: {
            $cond: [{
              $eq: ['$isTangible', true],
            }, '$totalMinutes', 0],
          },
          intangibleTime: {
            $cond: [{
              $eq: ['$isTangible', false],
            }, '$totalMinutes', 0],
          },
        }
      },
      {
        '$group': {
          '_id': {
            userId: '$userId', firstName: '$firstName', lastName: '$lastName',
            weeklyComittedHours: '$weeklyComittedHours'
          },
          totalMinutes: { $sum: '$totalMinutes' },
          tangibleTime: { $sum: '$tangibleTime' },
          intangibleTime: { $sum: '$intangibleTime' },
        },
      },
      {
        '$project': {
          '_id': 0,
          'uid': {
            '$toString': '$_id.userId'
          },
          firstName: '$_id.firstName',
          lastName: '$_id.lastName',
          totalMinutes: "$totalMinutes",
          weeklyComittedHours: '$_id.weeklyComittedHours',
          tangibleTime: '$tangibleTime',
          intangibleTime: '$intangibleTime',
          totaltime_hrs: {
            $divide: ['$totalMinutes', 60],
          },
          totaltangibletime_hrs: {
            $divide: ['$tangibleTime', 60],
          },
          totalintangibletime_hrs: {
            $divide: ['$intangibleTime', 60],
          },
          percentagespentintangible: {
            $cond: [{
              $eq: ['$totalMinutes', 0],
            }, 0, {
              $multiply: [{
                $divide: ['$tangibleTime', '$totalMinutes'],
              }, 100],
            }],
          },
        }
      },
      {
        $sort: {
          totaltangibletime_hrs: -1,
          name: 1,
        },
      },
    ];

    response = await Model.findByAggregate(collectionName, pipeline, options);

    return response;
  }
}

module.exports = TimesheetModel;
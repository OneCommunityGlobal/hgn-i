const Library = require('./library');
const MongoLibrary = require('./mongo-library');

class SecurityLibrary extends Library {

  //TODO fill this out to conform to hgn's security matrix
  //TODO make sure the checks flow in the correct order
  static async validateRequestorSecurity(requestorIdObj, securityObject) {

    var { collectionName = null, requestorId = null, method = null, dbMethod = null, userId = null,
      userName = null, query = null, ...rest } = securityObject;

    var response = {};

    //All database access requests require a requestor ID
    if (!requestorIdObj) {
      response.success = false;
      response.message = 'No Requestor ID Provided';
      response.errCode = 1;
      return response;
    };

    //Put the things everyone can do here
    //Anyone can create their own timesheet
    //Anyone can create a message to anyone
    //Anyone can see the members of a project?
    if (securityObject.method === 'createTimesheet'
      || securityObject.method === 'createMessage'
      || securityObject.method === 'getUsersByProjectId'
    ) {
      response.success = true;
      return response;
    }

    //TODO if certain securityObject values are always required, check here and return error if missing

    //Check whether the requestor has admin rights
    response = await MongoLibrary.getUserInfo(requestorIdObj);
    if (!response.success) return response;
    var requestorIsAdmin = response.data.isAdmin;
    var requestorUserName = response.data.userName;
    //Admins can do everything ?
    if (requestorIsAdmin) {
      response.success = true;
      return response;
    }

    //All checks below assume requestor is not an admin since we already checked for that

    //TODO if here then requestor is not admin and don't allow empty queries on the user collection
    // or queries that would return all users or null queries etc...
    if (dbMethod === 'findMany' && query && query.constructor === Object && Object.keys(query).length === 0) {
      response.success = false;
      response.data = null;
      response.message = "Requestor does not have permission - Empty query object";
      return response;
    }

    //Only admins can create and delete records ?
    if ((dbMethod.substring(0, 6) === 'insert' || dbMethod.substring(0, 6) === 'delete')) {
      response.success = false;
      response.data = null;
      response.message = "Only Admins Can Create/Delete Records";
      return response;
    }

    //A user can find and update its own info, but cannot access other user info
    //or delete it's own record
    if (collectionName === 'users' && !(userId === requestorId) && !(userName === requestorUserName)) {
      response.success = false;
      response.data = null;
      response.message = "Requestor does not have permission";
      return response;
    }

    //If here then success
    response.success = true;
    return response;
  }
}

module.exports = SecurityLibrary;
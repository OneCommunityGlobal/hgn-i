const Library = require('./library');

//TODO Need to decide how to store dates and datetimes in the database.
//Can convert and store all to Los Angeles time or in users local UTC based datetime?
class DateLibrary extends Library {

  static validateDate(dateStr, options) {
    //Should be string in format "yyyy-mm-dd"
    //Check valid year as current year +/- 1 year?
    //Month should be between 1 and 12 obvs
    var response = {};

    response.success = true;
    response.message = "";
    return response;

  }

  static validateDateTime(dateTimeStr, options) {
    //Should be in format "yyyy-mm-dd:hh:mm"
    //Time should be based on a 24 hr clock
    var response = {};

    response.success = true;
    response.message = "";
    return response;

  }

  static convertStringDateToDate(dateStr, options) {
    //Convert a string date in the format "yyyy-mm-dd" to a date object
    //and the time as 00:00:00
    var response = {};

    var dateObj = new Date(dateStr);

    response.success = true;
    response.data = dateObj;
    response.message = "";
    return response;
  }

  static convertStringDateTimeToDateTime(dateTimeStr, options) {
    //Convert a string datetime in the format "yyyy-mm-dd:hh:mm" to a datetime object
    //Time should be based on a 24 hr clock
    var response = {};

    var dateTimeObj = new Date(dateTimeStr);

    response.success = true;
    response.data = dateTimeObj;
    response.message = "";
    return response;
  }

  static convertDateTimeToPST(dateTimeObj, utcOffset = 0, options) {
    //Convert a DateTime value to US-LA time using the UTC offset in the users record or in the timesheet document
    //As noted above, must first decide how to store datetime in the database
    var response = {};

    var convertedDateTimeObj = dateTimeObj;

    response.success = true;
    response.data = convertedDateTimeObj;
    response.message = "";
    return response;
  }

  static convertPSTDateTimeToUsersLocalTime(dateTimeObj, utcOffset = 0, options) {
    //Convert a DateTime stored as US-LA time back to the users local datetime using the UTC offset in the users record
    //As noted above, must first decide how to store datetime in the database
    var response = {};

    var convertedDateTimeObj = dateTimeObj;

    response.success = true;
    response.data = convertedDateTimeObj;
    response.message = "";
    return response;
  }

}

module.exports = DateLibrary;

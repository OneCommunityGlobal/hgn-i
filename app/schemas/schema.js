class Schema {
    constructor(obj, options) {
        this.mongoTypes = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array'];
    }
}

//Schema.mongoTypes = require('./mongo/types/index');

Schema.prototype.doit = function () {
    console.log('In doit');
    somefunc();
    return;
};

function somefunc() {
    console.log('In Somefunc');
    return;
}

//Object.defineProperty(Schema, 'indexTypes', {
//  get: function() {
//    return indexTypes;
//  },
//  set: function() {
//    throw new Error('Cannot overwrite Schema.indexTypes');
//  }
//});

module.exports = Schema;
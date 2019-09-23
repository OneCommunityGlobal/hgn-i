class Controller {
  //This class cannot be instantiated with "new"
  constructor() {
    if (this.constructor === Controller) {
      throw new TypeError('Class cannot be instantiated directly.');
    }
  }

}

//use to define static properties which are not yet available
// Object.defineProperty(Controller, 'MongoLibrary', {value : MongoLibrary, writable : false});
// Object.defineProperty(Controller, 'SecurityLibrary', {value : SecurityLibrary, writable : false});

module.exports = Controller;
const express = require('express');
const allRouter = express.Router();
const fs = require('fs');

allRouter.all("/", function (req, res, next) {
    console.log('Home');
    res.send('Home');
});

allRouter.all("/login", function (req, res, next) {
    console.log('login');
    res.send('login');
});

/**
 * Universal router to capture and parse all routes except "/" and "/login"
 * 
 * All url's passed to the server should be in the form: /controller/method/parms
 * except when parms are passed using POST in body then it would be: /controller/method
 * 
 * @todo:
 * This is a roughed in version. Needs to do better url checking and validation and make sure flow is as expected.
 *
 */
allRouter.all("*", function (req, res, next) {
    if (req.method === "OPTIONS") {
        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        res.end();
        return;
    }

    const bypassedRoutes = ['/favicon.ico'];
    //TODO Better to check if in controller directory to check if valid
    const validControllers = ['user', 'timesheet'];

    const path = req.path;
    const pathSegmentsArr = path.split('/');
    const query = req.query;
    const body = req.body;
    const headers = req.headers;
    const host = req.hostname;
    const HTTPMethod = req.method;
    const routePath = req.route.path;

    //TODO check if valid controller. Look in array or controller folder?
    //TODO make sure each segment is valid. If not, default or return error?
    const controllerName = pathSegmentsArr[1];
    //TODO Check if method in class to validate
    const controllerMethod = pathSegmentsArr[2]
    //TODO improve this to use wildcards or regex
    bypassedRoutes.includes(path) ? next() : null;
    const controllerFile = '../controllers/' + controllerName + '-controller';
    const controller = require(controllerFile);

    //TODO Check if any additional segments other than controller/method
    //TODO and iterate over. For now only 1 additional segment is allowed which will
    //TODO be a MongoDb _id in string format.
    const uriParms = (pathSegmentsArr.length > 3 && pathSegmentsArr[3])
        ? {"parm1": pathSegmentsArr[3]}
        : null;

    //TODO Check if any body data passed
    const bodyParms = body;

    const parms = {...uriParms,...bodyParms}

    const executeControllerMethod = async function (parms) {

        //TODO Allow different encoding methods to be sent from front end?
        //TODO Currently assume JSON always sent. If not JSON then decode?
        // let bodyDataDecoded = decodeURI(req.body);
        // let bodyDataParsed = JSON.parse(req.body);

        //TODO Check if http method was get or post and derive parms accordingly
        //TODO or just always set to object and pass
        const response = await controller[controllerMethod](parms);

        //TODO make sure always returning JSON data. Set at lower levels or here ?
        // res.json(JSON.stringify(response));
        res.json(response);
        return;
    }

    //Now we've got all we need, execute the controller/method
    executeControllerMethod(parms);

});

module.exports = allRouter;

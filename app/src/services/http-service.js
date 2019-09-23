import config from "../config/config.json";

class HTTPService {
  static defaultHttpProtocol = "http";
  static defaultHttpMethod = "post";

  static makeAjaxRequest(urlPath = null, postData = null, bodyType = "j", headers = null) {
    const httpProtocol = this.defaultHttpProtocol;
    const httpMethod = this.defaultHttpMethod;
    const url = httpProtocol + "://" + config.server.host + ":" + config.server.port + urlPath;
    var response = {};

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(httpMethod, url);

      // time in milliseconds. Set based on typcial server load or 0 for no timeout
      xhr.timeout = 0;

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          try {
            response = JSON.parse(xhr.response);
            resolve(response);
          } catch (err) {
            response.success = false;
            response.errMessage = 'Failed to Convert Response Data From JSON';
            resolve(response);
          }
        } else {
          response.success = false;
          response.errMessage = xhr.statusText;
          response.errCode = this.status;
          reject(response);
        }
      };

      xhr.onerror = function () {
        response.success = false;
        response.errMessage = 'Failed to Convert Response Data From JSON';
        response.errCode = 1;
        reject(response);
      };

      xhr.ontimeout = function () {
        response.success = false;
        response.errMessage = 'Timed Out Waiting For Server Response';
        response.errCode = 201;
        reject(response);
      }

      if (!bodyType || bodyType.toLowerCase() === "j") {
        xhr.setRequestHeader("content-type", "application/json");
      }

      if (headers) {
        Object.keys(headers).forEach(function (key) {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      var params = postData;
      // We'll need to stringify if we've been given an object
      // If we have a string, this is skipped.
      if (params && typeof params === 'object') {
        params = Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
      };

      if (httpMethod === "get") {
        xhr.send();
      } else if (httpMethod === "post") {
        if(typeof postData === "undefined" || !postData) {
          response.success = false;
          response.errMessage = 'The Post Method Requires at Least 1 Parameter';
          response.errCode = 301;
          reject(response);          
        }else {
          let jsonpostData = JSON.stringify(postData);
          // let uriEncodedpostData = encodeURIComponent(jsonpostData);
          xhr.send(jsonpostData); //or params
        }
      } else {
        //response error bad method
      }
    });
  }
}

export default HTTPService;

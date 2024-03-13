import http from "node:http";
const handler = {};
const Server = (req, res) => {
  const SERVER_URL = new URL(req.url, `http://${req.headers.host}`);
  const reqUrl = SERVER_URL.pathname.toLowerCase();
  const reqMethod = req.method.toUpperCase();
  let searchParams = SERVER_URL.searchParams.entries();
  searchParams = Object.fromEntries(searchParams);
  req.searchParams = Object.keys(searchParams).length ? searchParams : null;
  res.json = function (data) {
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(data));
  };
  res.text = function (filePath) {
    res.setHeader("Content-type", "text/html");
    res.end(filePath);
  };
  if (["PUT", "POST"].includes(reqMethod)) {
    req.body = new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (buffer) => (data += buffer));
      req.on("end", () => {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          reject("ERROR");
          throw new Error({
            message: "Data is invalid",
            error: "SERVER ERROR",
          });
        }
      });
    });
  }
  let params = {};
  for (let key in handler) {
    if ("path" in handler[key]) {
      if (isMatchedWithRegex(handler[key].path, reqUrl)) {
        let keys = key
          .split("/:")
          .filter((item) => item !== "")
          .slice(1);
        let values = reqUrl
          .split("/")
          .filter((item) => item !== "")
          .slice(1);
        keys.map((key, index) => (params[key] = values[index]));
        req.params = Object.keys(params).length ? params : {};
        return handler[key][reqMethod](req, res);
      }
    }
  }
  if (handler[reqUrl]) {
    handler[reqUrl][reqMethod](req, res);
  }
};

function isMatchedWithRegex(regex, reqUrl) {
  reqUrl += reqUrl[reqUrl.length - 1] !== "/" ? "/" : "";   
  return reqUrl.match(regex)?.length ? true: false ;
}

const RegexGenerator = (url) => {
  let str = "";
  let params = "\\b.*?/";
  let ind = false;
  for (let i = 0; i < url.length; i++) {
    if (url[i] == ":") {
      str += params;
      ind = true;
    } else if (url[i] == "/" && ind) {
      ind = false;
    } else if (ind) {
      continue;
    } else {
      str += url[i];
    }
  }
  return new RegExp(str, "gis");
};

function isPathWithParams(reqUrl) {
  let regex = /\:.?/.test(reqUrl);
  return regex;
}

export class Express {
  constructor() {
    this.server = http.createServer(Server);
    this.get = function (pathname, callBackHander) {
      const reqUrl = pathname;
      handler[reqUrl] = handler[reqUrl] || {};
      handler[reqUrl]["GET"] = callBackHander;
      if (isPathWithParams(reqUrl))
        handler[reqUrl]["path"] = RegexGenerator(reqUrl);
    };
    this.post = function (pathname, callBackHander) {
      const reqUrl = pathname;
      handler[reqUrl] = handler[reqUrl] || {};
      handler[reqUrl]["POST"] = callBackHander;
    };
    this.put = function (pathname, callBackHander) {
        const reqUrl = pathname;
        handler[reqUrl] = handler[reqUrl] || {};
        handler[reqUrl]["PUT"] = callBackHander;       
    }
    this.delete = function(pathname, callBackHander){
        const reqUrl = pathname;
        handler[reqUrl] = handler[reqUrl] || {};
        handler[reqUrl]["DELETE"] = callBackHander
        if (isPathWithParams(reqUrl)) handler[reqUrl]["path"] = RegexGenerator(reqUrl);   
    }
    this.request = function(pathname, callBackHander, method){
        const reqUrl = pathname;
        const reqMethod = method.toUpperCase();
        const individualRequestMethods =  ["DELETE", "PUT", "POST"]
        handler[reqUrl] = handler[reqUrl] || {};
        handler[reqUrl][method] = callBackHander;
            
        if( individualRequestMethods.includes(reqMethod) ){
            if (isPathWithParams(reqUrl)) handler[reqUrl]["path"] = RegexGenerator(reqUrl);   
        }
    }
    this.listen = function (PORT, callBackHander) {
      this.server.listen(PORT, callBackHander);
    };
  }
}

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs =require('fs');
var statusCode = 200;
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
var db = [];
var headers = defaultCorsHeaders;
var responseBody;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  //console.log(request);

  //if user makes an OPTIONS request
    //send back the headers

  //if user makes a POST request (request.some property === POST)
    //store data from POST request
    //send the data back to the user with the proper headers (code = 200, etc)

  //if user makes a GET request (request.method === 'GET')
    //retreive all data applying callback to filter the data

  // The outgoing status.


  // See the note below about CORS headers.

  if(request.url.slice(0,9) === '/classes/'){
    roomName = request.url.slice(9).split('?')[0];
    headers['Content-Type'] = 'application/json';

    if (request.method === 'POST') {
      var json = '';
      var dateTime = Date.now();
      request.on('data', function(datum){
        json += datum.toString();
      });
      request.on('end', function() {
        json = JSON.parse(json);
        json.createdAt = dateTime;
        json.objectId =dateTime;
        db.push(json);
        statusCode = 201;
        responseBody = JSON.stringify(json);
        response.writeHead(statusCode, headers);
        response.end(responseBody);
      });
    } else if (request.method === 'GET') {
      responseBody = JSON.stringify({results: db});
      response.writeHead(statusCode, headers);
      response.end(responseBody);
    }
  } else if(request.url === '/') {
    readFile('./client/refactor.html', response);
  } else {
    readFile('./client' + request.url, response);
  } 

  /*else if (fs.exists('./client' + request.url)) {
    readFile('./client' + request.url, response);
  } else {
    statusCode = 404;
    responseBody = 'Unknown URL';
    response.writeHead(statusCode, headers);
    response.end(responseBody);
  }*/


  //if /classes/
    //normal GET/POST handling
  //else
    //readFile(./client + url, callback(){
      //get the file and return it if successful
      //return 404 if unsuccessful




  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //

  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(responseBody);
};

module.exports.requestHandler = requestHandler;

var readFile = function(fileName, response){
  fs.readFile(fileName, function(error, content) {
    if (error) {
      console.log('pb')
      statusCode = 400;        
      response.writeHead(statusCode, headers);
      response.end('test', 'utf-8');
    }
    else {
      var contentType;
      var encoding = 'utf-8';
      console.log('ok')
      statusCode = 200;
      ext = fileName.split('.')[1];
      if (ext === 'js') {
        contentType = 'text/javascript';
      } else if (ext === 'css') {
        contentType = 'text/css';
      } else if (ext === 'html') {
        contentType = 'text/html';
      } else if (ext === 'gif') {
        contentType = 'image/gif';
        encoding = 'binary'
      }
      headers['Content-Type'] = contentType;
      responseBody = content;
      response.writeHead(statusCode, headers);
      response.end(responseBody, encoding);
      return;
    }
  });
}
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
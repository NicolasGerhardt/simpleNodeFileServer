const fs = require('fs');
const http = require('http');
const url = require('url');

const publicFolder = "./public";

const port = 8000;


console.log('== Starting Server ==');
http.createServer(setupServer).listen(port);
console.log('== Server Listening ==');


function setupServer(req, res) {
  let q = url.parse(req.url, true);
  let filename = publicFolder + q.pathname;

  if (filename == publicFolder +'/') {
    filename = publicFolder + '/index.html';
  }

  console.log('Atempting to open: ' + filename);
  fs.readFile(filename, (err, data) => {
    if (err) {
      console.log('Could not find: ' + filename);
      res.writeHead(404, {'Content-Type' : 'text/html'});
      return res.end(`<html><body><h1>404 File Not Found! </h1></body></html>`);
    }

    console.log('Found file, loading: ' + filename);
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write(data);
    return res.end();
  });
}
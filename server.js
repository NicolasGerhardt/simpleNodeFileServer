const fs = require('fs');
const http = require('http');
const url = require('url');

const publicFolder = './public';
const index = 'index.html';

const port = 8000;


updateIndexHTML();

console.log('== Starting Server ==');
http.createServer(setupServer).listen(port);
console.log('== Server Listening ==');


function setupServer(req, res) {
  let q = url.parse(req.url, true);
  let filename = publicFolder + q.pathname;

  if (filename == publicFolder +'/') {
    updateIndexHTML();
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



function updateIndexHTML() {
  console.log('Updating Index.html file');

  let files = fs.readdirSync(publicFolder);
  files = filterOutArray(files, 'index.html');
  files = filterOutArray(files, '.DS_Store');
  let listItems = [];

  for (let i = 0; i < files.length; i++) {
    listItems.push(createListItem(files[i]));
  }
  
  let listHTMLData = listItems.join('');

  let HTML = `
  <html>
  <body>
  <h1>
  Index File Listening
  </h1>
  <ul>
  ${listHTMLData}
  </ul>
  </body>
  </html>

  `;

  fs.writeFileSync(publicFolder + '/index.html', HTML);


  function filterOutArray(arr, obj) {
    return arr.filter(file => file != obj);
  }

  function createListItem(item) {
    return `<li><a href='${item}'>${item}</a></li>`
  }

  console.log('Index.html updated')
}

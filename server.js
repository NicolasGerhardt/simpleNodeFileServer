const fs = require('fs');
const http = require('http');
const url = require('url');

const publicFolder = './public';
const index = 'index.html';

const port = 8000;


updateIndexHTML();

console.log('=====================');
console.log('== Starting Server ==');
http.createServer(setupServer).listen(port);
console.log('== Server Listening ==');
console.log('=====================');
console.log(`You can connect through localhost:${port}`);
console.log('Kill server with ctrl + C');
console.log('=====================');


function setupServer(req, res) {
  let q = url.parse(req.url, true);
  let filename = publicFolder + q.pathname;

  if (filename == publicFolder +'/') {
    updateIndexHTML();
    filename = publicFolder + '/index.html';
  }

  console.log(`Atempting to open: ${filename}`);
  fs.readFile(filename, (err, data) => {
    if (err) {
      console.log(`Could not find: ${filename}`);
      res.writeHead(404, {'Content-Type' : 'text/html'});
      return res.end(`
                <html><body>
                <h1>404 File Not Found!</h1>
                <p><a href='/index.html'>Return home</a></p>
                </body></html>
                `);
    }

    console.log(`Found file, loading: ${filename}`);
    if (filename.toLowerCase().includes(".html")) {
      res.writeHead(200, {'Content-Type' : 'text/html'});
    } else if (filename.toLowerCase().includes(".css")) {
      res.writeHead(200, {'Content-Type' : 'text/css'});
    } else if (filename.toLowerCase().includes(".js")) {
      res.writeHead(200, {'Content-Type' : 'text/javascript'});
    } else if (filename.toLowerCase().includes(".png")) {
      res.writeHead(200, {'Content-Type' : 'image/png'});
    }
    res.write(data);
    console.log(`Found file, sent: ${filename}`);
    return res.end();
  });
}



function updateIndexHTML() {
  console.log(`Updating Index.html file`);

  let files = fs.readdirSync(publicFolder);
  files = filterOutArray(files, 'index.html');
  files = filterOutArray(files, '.DS_Store');
  let listItems = [];

  for (let i = 0; i < files.length; i++) {
    listItems.push(createListItem(files[i]));
  }

  let HTMLListData = listItems.join('');

  let HTML = `
  <html>
  <body>
  <h1>
  Index File
  </h1>
  <ul>
  ${HTMLListData}
  </ul>
  </body>
  </html>

  `;

  fs.writeFileSync(publicFolder + '/index.html', HTML);


  function filterOutArray(arr, obj) {
    return arr.filter(file => file != obj);
  }

  function createListItem(item) {
    return `<li><a href='${item}/index.html'>${item}</a></li>`
  }

  console.log('Index.html updated')
}

const fs = require("fs");
const fsPath = require('path');

const deleteFile = (path) => {
    if (fs.existsSync(path)) {

        fs.readdirSync(path).forEach((file) => {
          const curPath = fsPath.join(path, file);
          if (fs.lstatSync(curPath).isDirectory())
            deleteFile(curPath);
          else
            fs.unlinkSync(curPath);
        });

        fs.rmdirSync(path);

    }
}

fs.existsSync('./playground') ?
    null : fs.mkdirSync('./playground');

deleteFile('./playground/dist');
deleteFile('./playground/node-dist');

const json =
`{
    "name": "playground",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "author": ""
}`

const html = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./index.sass">
    <title>Document</title>
</head>
<body>
    <div id='app'></div>
    <script src='index.ts'></script>
</body>
</html>`;

[
    'node-index.ts',
    'index.ts',
    'index.sass',
    ['index.html', html],
    ['package.json', json]
].forEach((file) => {
    let path = './playground/';
    let data = '';
    if (Array.isArray(file)) {
        path += file[0];
        data = file[1];
    } else {
        path += file;
    }

    fs.existsSync(path) ? null : fs.writeFileSync(path, data);
});

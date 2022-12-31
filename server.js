const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
const fs = require('fs');

// Configuration

server.listen(process.env.PORT || 8000, () => {
  console.log(`[ server.js ] Listening on port ${server.address().port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/panchang.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/panchang.js'));
});
app.get('/suncalc.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/suncalc.js'));
});

app.get('/lunarphase.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/lunarphase.js'));
});
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/styles.css'));
});
app.get('/new.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/new.css'));
});
app.get('/reset.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/reset.css'));
});

var imagesRootPath = '/home/rammohanyadavalli/Pictures/slideshow';
app.get('/images', (req, res) => {
    imagesRootPath = path.join(__dirname, 'slideshow_images');
    let iPath = req.query.folder;
    let files = getFiles(imagesRootPath + '/' + iPath);
    res.send(files);
});
app.get('/showimage', function (req, res) {
//    console.log(`file path `, JSON.stringify(req.query))
     res.sendFile(req.query.imagePath);
});
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

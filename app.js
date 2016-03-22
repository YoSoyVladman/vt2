
var BinaryServer, express, http, app, video, server, bs, omx;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
app          = express();
video        = require('./lib/video');
path         = require('path');
omx = require('omx-manager');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/subir',function(req,res){
  res.sendfile('views/subir.html');
  //It will find and locate index.html from View or Scripts
});


app.get('/control',function(req,res){
  res.sendfile('views/control.html');
  //It will find and locate index.html from View or Scripts
});

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Video Server started on http://0.0.0.0:3000');
});

bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {


    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
                video.request(client, meta);
                break;

            // attempt an upload
            case 'upload':
            default:
                video.upload(stream, meta);
        }
    });


    client.on('control', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
                video.request(client, meta);
                break;

            // attempt an upload
            case 'upload':
            default:
                video.upload(stream, meta);
        }
    });
});

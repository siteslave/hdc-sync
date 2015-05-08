var Server = {
    start: function (host, port) {

        var express = require('express'),
            app = express(),
            multer = require('multer');


        app.use(multer({
            dest: './uploads'
        }));


        app.get('/', function (req, res) {
            res.send('Hello world!');
        });

        var server = app.listen(port, host, function () {

            console.log('Start hdc-sync server on http://%s:%s', host, port);
        });


    }
};

module.exports = Server;
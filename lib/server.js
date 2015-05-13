
var fse = require('fs-extra'),
    colors = require('cli-color'),
    express = require('express'),
    app = express(),
    multer = require('multer'),
    Log = require('log'),
    hdcImport = require('./hdc-import');

module.exports = {
    init: function (config) {

        fse.ensureFileSync(config.config.server.logPath);
        log = new Log('debug', config.config.server.logPath);

        var port = config.config.server.port || 8888,
            host = config.config.server.address || '127.0.0.1';

        app.use(multer({
            dest: config.config.server.uploadPath,
            rename: function (fieldname, filename) {
                return filename.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now()
            }
        }));

        app.get('/', function (req, res) {
            res.send('Welcome to hdc-sync server!');
        });

        app.get('/status', function (req, res) {
            res.send({ok: true});
        });

        app.post('/upload', function (req, res) {
            //console.log(req.files.file);
            console.log('You have new file: ' + colors.green(req.files.file.originalname));
            hdcImport.doImport(req.files.file.path, config.config.server);
            res.send({ok: true});
        });

        var server = app.listen(port, host, function () {
            //console.log(colors.green('Starting...'));
            var strHost = 'http://' + host + ':' + port;
            console.log(colors.blue('Start hdc-sync server on ') + colors.red.underline(strHost));
            console.log('Process id: %s', process.pid);
        });

    }
};
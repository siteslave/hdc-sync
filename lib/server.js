
var fse = require('fs-extra'),
    colors = require('cli-color'),
    express = require('express'),
    app = express(),
    multer = require('multer'),
    path = require('path'),
    yaml = require('yamljs'),
    Log = require('log'),
    Random = require('random-js'),
    hdcImport = require('./hdc-import');

module.exports = {
    init: function (config) {

        fse.ensureFileSync(config.logPath);
        fse.ensureDirSync(config.publicPath);

        log = new Log('debug', config.logPath);

        var port = config.port || 8888,
            host = config.address || '127.0.0.1';

        app.use(multer({
            dest: config.uploadPath,
            rename: function (fieldname, filename) {
                return filename.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now()
            }
        }));

        app.use(express.static(config.publicPath));

        app.get('/', function (req, res) {
            res.send('Welcome to hdc-sync server!');
        });

        app.get('/status', function (req, res) {
            res.send({ok: true});
        });

        // app.get('/files/sql', function (req, res) {
        //
        //     // console.log('Starting send SQL file.');
        //     // res.download(config.sqlPath, 'sql.yaml');
        //     var sql = yaml.load(config.sqlPath);
        //
        //     res.send({sql: sql});
        //
        // });

        app.post('/upload', function (req, res) {
            //console.log(req.files.file);
            console.log('You have new file: ' + colors.green(req.files.file.originalname));
            var province = req.body.province;
            //console.log(province);
            // Get files list
            var zipFile = req.files.file.path;
            // Create new extract path
            var random = new Random();
            var strRandom = random.hex(20, true);
            var destPath = path.join(config.extractPath, strRandom);
            // Create directory
            fse.ensureDirSync(destPath);

            var files = hdcImport.doExtract(zipFile, destPath);

            var db = require('knex')({
                client: 'mysql',
                connection: {
                    host: config.dc.address,
                    port: config.dc.port.toString(),
                    database: config.dc.database.toString(),
                    user: config.dc.user.toString(),
                    password: config.dc.password.toString()
                },
                pool: {
                    min: 0,
                    max: 1000
                },
                debug: false
            });

            if (files.length) {

                hdcImport.doImport(db, files)
                    .then(function () {
                        fse.deleteSync(destPath);
                        hdcImport.setLog(db, province, req.files.file.originalname)
                            .then(function () {
                                //success
                                res.send({ok: true});
                            }, function (err) {
                                console.log(err);
                                res.send({ok: false, msg: err});
                            });
                    }, function (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    });

            } else {
                console.log('Text file not found.');
                res.send({ok: false, msg: 'Text file not found'});
            }

        });

        var server = app.listen(port, host, function () {
            //console.log(colors.green('Starting...'));
            var strHost = 'http://' + host + ':' + port;
            console.log(colors.blue('Start hdc-sync server on ') + colors.red.underline(strHost));
            console.log('Process id: ' + colors.red(process.pid));
        });

    }
};

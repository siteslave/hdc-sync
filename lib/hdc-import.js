var Zip = require('adm-zip'),
    Finder = require('fs-finder'),
    Random = require('random-js'),
    path = require('path'),
    fse = require('fs-extra'),
    fs = require('fs'),
    _ = require('lodash'),
    colors = require('cli-color'),
    Q = require('q'),
    finder = require('fs-finder'),
    Importor = require('./importor.js');

var HDCImportor = {};
require('q-foreach')(Q);

HDCImportor.startImport = function (inputFile, config) {

    var isDirectory = fs.lstatSync(inputFile).isDirectory();

    if (isDirectory) {
        var files = finder.in(inputFile).findFiles();
        var zipFiles = [];

        _.forEach(files, function(v) {
            if (path.extname(v).toUpperCase() == '.ZIP') {
                zipFiles.push(v);
            }
        });

        if (zipFiles.length) {
            console.log(colors.blue('Importing files: '));

            Q.forEach(zipFiles, function (v) {
                var defer = Q.defer();
                // Create new extract path
                var random = new Random();
                var strRandom = random.hex(20, true);
                var destPath = path.join(config.extractPath, strRandom);
                // Create directory
                fse.ensureDirSync(destPath);

                var txtFiles = HDCImportor.doExtract(v, destPath);

                HDCImportor.doImport(txtFiles, config)
                    .then(function () {
                        console.log(colors.green('- ' + path.basename(v) + ' ... ') + colors.green('OK'));
                        fse.deleteSync(destPath);
                        defer.resolve();
                    }, function (err) {
                        console.log(colors.green('- ' + path.basename(v) + ' ... ') + colors.green('FAILED'));
                        fse.deleteSync(destPath);
                        defer.reject(err);
                    });
                return defer.promise;
            }).then(function () {
                console.log(colors.green('Successfully'));
                process.exit(0);
            });

        } else {
            console.log('File(s) not found!');
        }

    } else {
        // Import single file
        console.log('Start import file: ' + inputFile);

        var random = new Random();
        var strRandom = random.hex(20, true);
        var destPath = path.join(config.extractPath, strRandom);
        // Create directory
        fse.ensureDirSync(destPath);

        var txtFiles = HDCImportor.doExtract(inputFile, destPath);

        HDCImportor.doImport(txtFiles, config)
            .then(function () {
                console.log(colors.green('- ' + path.basename(inputFile) + ' ... ') + colors.green('OK'));
                fse.deleteSync(destPath);
                process.exit(0);
            }, function (err) {
                console.log(colors.green('- ' + path.basename(inputFile) + ' ... ') + colors.green('FAILED'));
                fse.deleteSync(destPath);
                process.exit(1);
            });

    }
};

HDCImportor.doExtract = function (zipFile, destPath) {

    var zip = new Zip(zipFile);
    zip.extractAllTo(destPath, true);

    return Finder.from(destPath).findFiles('*.txt');
};

HDCImportor.doImport = function (files, config) {

    // Create file array
    var allFiles = [];
    // Get full file path
    _.forEach(files, function (file) {
        var fileName = path.basename(file).toUpperCase();

        if (fileName == 'S_PERSON_PYRAMID.TXT') allFiles.S_PERSON_PYRAMID = file;
        if (fileName == 'S_CMI_SUMMARY_REGION.TXT') allFiles.S_CMI_SUMMARY_REGION = file;
        if (fileName == 'S_ANC.TXT') allFiles.S_ANC = file;
        if (fileName == 'S_BREAST_SCREEN.TXT') allFiles.S_BREAST_SCREEN = file;
        if (fileName == 'S_CA_BREAST_POP_AGE.TXT') allFiles.S_CA_BREAST_POP_AGE = file;
        if (fileName == 'S_CA_CERVIX_POP_AGE.TXT') allFiles.S_CA_CERVIX_POP_AGE = file;
        if (fileName == 'S_CA_LUNG_POP_AGE.TXT') allFiles.S_CA_LUNG_POP_AGE = file;
        if (fileName == 'S_CARD.TXT') allFiles.S_CARD = file;
        if (fileName == 'S_CERVIX_SCREEN.TXT') allFiles.S_CERVIX_SCREEN = file;
        if (fileName == 'S_CMI_SUMMARY_MDC.TXT') allFiles.S_CMI_SUMMARY_MDC = file;
        if (fileName == 'S_EPI5.TXT') allFiles.S_EPI5 = file;
    });

    var db = require('knex')({
        client: 'mysql',
        connection: {
            host: config.dc.address,
            port: config.dc.port,
            database: config.dc.database,
            user: config.dc.user,
            password: config.dc.password
        },
        pool: {
            min: 0,
            max: 1000
        },
        debug: false
    });


    var q = Q.defer();

    Importor.importAnc(db, allFiles.S_ANC)
        .then(function () {
            if (allFiles.S_BREAST_SCREEN) return Importor.importBreastScreen(db, allFiles.S_BREAST_SCREEN)
            return;
        })
        .then(function () {
            if (allFiles.S_PERSON_PYRAMID) return Importor.importPersonPyramid(db, allFiles.S_PERSON_PYRAMID)
            return;
        })
        .then(function () {
            q.resolve();
        }, function (err) {
            q.reject(err);
        });

        return q.promise;
};

module.exports = HDCImportor;

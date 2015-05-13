var Zip = require('adm-zip'),
    Finder = require('fs-finder'),
    Random = require('random-js'),
    path = require('path'),
    fse = require('fs-extra'),
    _ = require('lodash'),
    colors = require('cli-color'),
    Importor = require('./importor.js');

module.exports = {

    doImport: function (file, config) {
        // Create new extract path
        var random = new Random();
        var strRandom = random.hex(20, true);
        var destPath = path.join(config.extractPath, strRandom);
        // Create directory
        fse.ensureDirSync(destPath);
        var zip = new Zip(file);
        zip.extractAllTo(destPath, true);

        var files = Finder.from(destPath).findFiles('*.txt');
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

        Importor.importAnc(db, allFiles.S_ANC)
            .then(function () {
                return Importor.importBreastScreen(db, allFiles.S_BREAST_SCREEN)
            })
            .then(function () {
                return Importor.importPersonPyramid(db, allFiles.S_PERSON_PYRAMID)
            })
            .then(function () {
                // remove file
                fse.deleteSync(destPath);
                console.log(colors.green('Import successfully.'));
            }, function (err) {
                console.log(err);
            });
    }

};

var hdc = require('./hdc-export');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var colors = require('cli-color');
var _ = require('lodash');
var moment = require('moment');
var Progress = require('progress');
var upload = require('./hdc-upload');

var stdConfig = require('./config');

module.exports = {

    startSync: function (configData, year) {

        var config = configData.config.client;

        var db = require('knex')({
            client: 'mysql',
            connection: {
                host: config.hdc.address,
                port: config.hdc.port,
                database: config.hdc.database,
                user: config.hdc.user,
                password: config.hdc.password
            },
            pool: {
                min: 0,
                max: 500
            },
            debug: false
        });

        var uploadUrl = 'http://' + config.server.address + ':' + config.server.port + '/upload';

        // Start export
        var files = stdConfig.getFiles(config);
        var headers = stdConfig.getHeaders();

        var promise = hdc.getPersonPyramid(db, year);

        promise.then(function (rows) {

            fs.writeFileSync(files.personPyramid, headers.personPyramid);

            if (rows[0].length) {
                var total = rows[0].length;
                //console.log('- s_person_pyramid [%d] ', total);

                var bar = new Progress('- s_person_pyramid \t\t\t [:current/:total] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: '50',
                    total: total
                });

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.groupcode = v.groupcode;
                    obj.groupname = v.groupname;
                    obj.male = v.male;
                    obj.female = v.female;
                    obj.total = v.total;

                    var str = [obj.hospcode, obj.areacode, obj.date_com, obj.b_year, obj.groupcode,
                            obj.groupname, obj.male, obj.female, obj.total].join('|') + '\n';

                    fs.appendFileSync(files.personPyramid, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_person_pyramid [0]'));
            }

            return hdc.getAnc(db, year);

        }).then(function (rows) {

            fs.writeFileSync(files.anc, headers.anc);

            if (rows[0].length) {

                var total = rows[0].length;
                //console.log('- s_anc [%d]', total)

                var bar = new Progress('- s_anc \t\t\t\t [:current/:total] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: '50',
                    total: total
                });

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.target = v.target;
                    obj.result = v.result;
                    obj.result01 = v.result01;
                    obj.result02 = v.result02;
                    obj.result03 = v.result03;
                    obj.result04 = v.result04;
                    obj.result05 = v.result05;
                    obj.result06 = v.result06;
                    obj.result07 = v.result07;
                    obj.result08 = v.result08;
                    obj.result09 = v.result09;
                    obj.result10 = v.result10;
                    obj.result11 = v.result11;
                    obj.result12 = v.result12;

                    var str = [obj.hospcode, obj.areacode, obj.date_com, obj.b_year, obj.target,
                            obj.result, obj.result01, obj.result02, obj.result03, obj.result04, obj.result05,
                            obj.result06, obj.result07, obj.result08, obj.result09, obj.result10, obj.result11, obj.result12
                        ].join('|') + '\n';

                    fs.appendFileSync(files.anc, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_anc [0]'));
            }

            return hdc.getBreastScreen(db, year);

        }).then(function (rows) {

            fs.writeFileSync(files.breast_screen, headers.breast_screen);

            if (rows[0].length) {
                var total = rows[0].length;
                //console.log('- s_breast_screen [%d]', total);

                var bar = new Progress('- s_breast_screen \t\t\t [:current/:total] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: '50',
                    total: total
                });

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.target = v.target;
                    obj.result = v.result;

                    var str = [obj.hospcode, obj.areacode, obj.date_com, obj.b_year, obj.target, obj.result].join('|') + '\n';

                    fs.appendFileSync(files.breast_screen, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_breast_screen [0]'));
            }

            return hdc.getCaBreastPopAge(db, year);

        }).then(function (rows) {

            fs.writeFileSync(files.ca_breast_pop_age, headers.ca_breast_pop_age);

            if (rows[0].length) {
                var total = rows[0].length;
                //console.log('- s_ca_breast_pop_age [%d] ', total);

                var bar = new Progress('- s_ca_breast_pop_age \t\t\t [:current/:total] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: '50',
                    total: total
                });

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.pop_group1 = v.pop_group1;
                    obj.result_group1 = v.result_group1;
                    obj.pop_group2 = v.pop_group2;
                    obj.result_group2 = v.result_group2;
                    obj.pop_group3 = v.pop_group3;
                    obj.result_group3 = v.result_group3;
                    obj.pop_group4 = v.pop_group4;
                    obj.result_group4 = v.result_group4;
                    obj.pop_group5 = v.pop_group5;
                    obj.result_group5 = v.result_group5;

                    var str = [
                            obj.hospcode, obj.areacode, obj.date_com, obj.b_year,
                            obj.pop_group1, obj.result_group1, obj.pop_group2, obj.result_group2,
                            obj.pop_group3, obj.result_group3, obj.pop_group4, obj.result_group4,
                            obj.pop_group5, obj.result_group5
                        ].join('|') + '\n';

                    fs.appendFileSync(files.ca_breast_pop_age, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_ca_breast_pop_age [0]'));
            }

            return hdc.getCaCervixPopAge(db, year);

        }).then(function (rows) {

            fs.writeFileSync(files.ca_cervix_pop_age, headers.ca_cervix_pop_age);

            if (rows[0].length) {
                var total = rows[0].length;
                //console.log('- s_ca_cervix_pop_age [%d]', total);
                var bar = new Progress('- s_ca_cervix_pop_age \t\t\t [:current/:total] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: '50',
                    total: total
                });

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.pop_group1 = v.pop_group1;
                    obj.result_group1 = v.result_group1;
                    obj.pop_group2 = v.pop_group2;
                    obj.result_group2 = v.result_group2;
                    obj.pop_group3 = v.pop_group3;
                    obj.result_group3 = v.result_group3;
                    obj.pop_group4 = v.pop_group4;
                    obj.result_group4 = v.result_group4;
                    obj.pop_group5 = v.pop_group5;
                    obj.result_group5 = v.result_group5;

                    var str = [
                            obj.hospcode, obj.areacode, obj.date_com, obj.b_year,
                            obj.pop_group1, obj.result_group1, obj.pop_group2, obj.result_group2,
                            obj.pop_group3, obj.result_group3, obj.pop_group4, obj.result_group4,
                            obj.pop_group5, obj.result_group5
                        ].join('|') + '\n';

                    fs.appendFileSync(files.ca_cervix_pop_age, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_ca_cervix_pop_age [0]'));
            }

            var strZipFile = configData.provinceCode + '-' + moment().format('YYYYMMDDHHmmss') + '.zip';
            var zipFile = path.join(config.outboxPath, strZipFile);

            //
            var AdmZip = require('adm-zip'),
                zip = new AdmZip();

            zip.addLocalFile(files.personPyramid);
            zip.addLocalFile(files.anc);
            zip.addLocalFile(files.breast_screen);
            zip.addLocalFile(files.ca_breast_pop_age);
            zip.addLocalFile(files.ca_cervix_pop_age);
            //var fTotal = _.size(files);
            //var barZip = new Progress('Creating zip file [:total] [:bar] :percent :etas', {
            //    complete: '#',
            //    incomplete: ' ',
            //    width: '100',
            //    total: fTotal
            //});
            //
            //_.forEach(files, function (f) {
            //    zip.addLocalFile(f);
            //    barZip.tick();
            //});

            zip.writeZip(zipFile);

            console.log(colors.green('Success! '));
            console.log('File ' + colors.red.bold(zipFile) +' was created.');
            console.log('Starting upload file.');

            var dotCount = 0;

            setInterval(function () {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                dotCount = (dotCount + 1) % 5;
                var dots = new Array(dotCount + 1).join('.');
                process.stdout.write("Uploading" + dots);
            }, 300);


            upload.doUpload(uploadUrl, zipFile)
                .then(function () {
                    console.log();
                    console.log(colors.green.blink('OK'));
                    process.exit(0);
                }, function (err) {
                    console.log();
                    console.log(colors.red.blink('FAILED'));
                    console.log();
                    console.log(colors.red(err));

                    process.exit(1);
                });

        }, function (err) {
            console.log(colors.red(err));
        });

    }
};

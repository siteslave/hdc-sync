
var hdc = require('./hdc-export');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var colors = require('cli-color');
var _ = require('lodash');
var moment = require('moment');
var Progress = require('progress');
var upload = require('./hdc-upload');

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
        var files = {};
        var headers = {};

        files.personPyramid = path.join(config.exportPath, 's_person_pyramid.txt');
        files.anc = path.join(config.exportPath, 's_anc.txt');
        files.breast_screen = path.join(config.exportPath, 's_breast_screen.txt');
        files.ca_breast_pop_age = path.join(config.exportPath, 's_ca_breast_pop_age.txt');
        files.ca_cervix_pop_age = path.join(config.exportPath, 's_ca_cervix_pop_age.txt');
        files.ca_lung_pop_age = path.join(config.exportPath, 's_ca_lung_pop_age.txt');
        files.card = path.join(config.exportPath, 's_card.txt');
        files.cervix_screen = path.join(config.exportPath, 's_cervix_screen.txt');
        files.child = path.join(config.exportPath, 's_child.txt');

        headers.personPyramid = ['hospcode', 'areacode', 'date_com', 'b_year', 'groupcode', 'groupname', 'male', 'female', 'total'].join('|') + '\n';
        headers.anc = ['hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result', 'result01', 'result02', 'result03',
            'result04', 'result05', 'result06', 'result07', 'result08', 'result09', 'result10', 'result11', 'result12'].join('|') + '\n';
        headers.breast_screen = ['hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result'].join('|') + '\n';
        headers.ca_breast_pop_age = [
                'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
            ].join('|') + '\n';

        headers.ca_cervix_pop_age = [
                        'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                        'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                        'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
                    ].join('|') + '\n';

        headers.ca_lung_pop_age = [
                        'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                        'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                        'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
                    ].join('|') + '\n';

        headers.card = [
                        'hospcode', 'areacode', 'date_com', 'b_year', 'pop',
                        'inscl1', 'inscl2', 'inscl3', 'inscl4', 'inscl5'
                    ].join('|') + '\n';

        headers.cervix_screen = ['hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result'].join('|') + '\n';
        headers.child = [
                'hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result',
                'target01', 'result01', 'target02', 'result02', 'target03', 'result03',
                'target04', 'result04', 'target05', 'result05', 'target06', 'result06',
                'target07', 'result07', 'target08', 'result08', 'target09', 'result09',
                'target10', 'result10', 'target11', 'result11', 'target12', 'result12'
            ].join('|') + '\n';

        var promise = hdc.getPersonPyramid(db, year);

        promise.then(function (rows) {
            var total = rows[0].length;
            var bar = new Progress('- s_person_pyramid [:total] [:bar] :percent :etas', {
                complete: '#',
                incomplete: ' ',
                width: '100',
                total: total
            });

            fs.writeFileSync(files.personPyramid, headers.personPyramid);
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

            return hdc.getAnc(db, year);

        }).then(function (rows) {

            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_anc [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.anc, headers.anc);
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
                console.log(colors.red('- s_anc'));
            }

            return hdc.getBreastScreen(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_breast_screen [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.breast_screen, headers.breast_screen);

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
                console.log(colors.red('- s_breast_screen'));
            }

            return hdc.getCaBreastPopAge(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_ca_breast_pop_age [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.ca_breast_pop_age, headers.ca_breast_pop_age);

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
                console.log(colors.red('- s_ca_breast_pop_age'));
            }

            return hdc.getCaCervixPopAge(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_ca_cervix_pop_age [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.ca_cervix_pop_age, headers.ca_cervix_pop_age);

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
                console.log(colors.red('- s_ca_cervix_pop_age'));
            }

            return hdc.getCaLungPopAge(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_ca_lung_pop_age [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.ca_lung_pop_age, headers.ca_lung_pop_age);

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

                    fs.appendFileSync(files.ca_lung_pop_age, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_ca_lung_pop_age'));
            }

            return hdc.getCard(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_card [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.card, headers.card);

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.pop = v.pop;
                    obj.inscl1 = v.inscl1;
                    obj.inscl2 = v.inscl2;
                    obj.inscl3 = v.inscl3;
                    obj.inscl4 = v.inscl4;
                    obj.inscl5 = v.inscl5;

                    var str = [
                            obj.hospcode, obj.areacode, obj.date_com, obj.b_year,
                            obj.pop, obj.inscl1, obj.inscl2, obj.inscl3, obj.inscl4, obj.inscl5
                        ].join('|') + '\n';

                    fs.appendFileSync(files.card, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_card [0]'));
            }

            return hdc.getCervixScreen(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_cervix_screen [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.cervix_screen, headers.cervix_screen);

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.target = v.target;
                    obj.result = v.result;

                    var str = [
                            obj.hospcode, obj.areacode, obj.date_com, obj.b_year, obj.target, obj.result
                        ].join('|') + '\n';

                    fs.appendFileSync(files.cervix_screen, str);

                    bar.tick();
                });
            } else {
                console.log(colors.red('- s_cervix_screen [0]'));
            }

            return hdc.getChild(db, year);

        }).then(function (rows) {
            if (rows[0].length) {
                var total = rows[0].length;
                var bar = new Progress('- s_child [:total] [:bar] :percent :etas', {
                    complete: '#',
                    incomplete: ' ',
                    width: '100',
                    total: total
                });

                fs.writeFileSync(files.child, headers.child);

                _.forEach(rows[0], function (v) {
                    var obj = {};
                    obj.hospcode = v.hospcode;
                    obj.areacode = v.areacode;
                    obj.date_com = v.date_com;
                    obj.b_year = v.b_year;
                    obj.target = v.target;
                    obj.result = v.result;
                    obj.target01 = v.target01;
                    obj.result01 = v.result01;
                    obj.target02 = v.target02;
                    obj.result02 = v.result02;
                    obj.target03 = v.target03;
                    obj.result03 = v.result03;
                    obj.target04 = v.target04;
                    obj.result04 = v.result04;
                    obj.target05 = v.target05;
                    obj.result05 = v.result05;
                    obj.target06 = v.target06;
                    obj.result06 = v.result06;
                    obj.target07 = v.target07;
                    obj.result07 = v.result07;
                    obj.target08 = v.target08;
                    obj.result08 = v.result08;
                    obj.target09 = v.target09;
                    obj.result09 = v.result09;
                    obj.target10 = v.target10;
                    obj.result10 = v.result10;
                    obj.target11 = v.target11;
                    obj.result11 = v.result11;
                    obj.target12 = v.target12;
                    obj.result12 = v.result12;

                    var str = [
                            obj.hospcode, obj.areacode, obj.date_com, obj.b_year, obj.target, obj.result,
                            obj.target01, obj.result01, obj.target02, obj.result02, obj.target03, obj.result03,
                            obj.target04, obj.result04, obj.target05, obj.result05, obj.target06, obj.result06,
                            obj.target07, obj.result07, obj.target08, obj.result08, obj.target09, obj.result09,
                            obj.target10, obj.result10, obj.target11, obj.result11, obj.target12, obj.result12
                        ].join('|') + '\n';

                    fs.appendFileSync(files.child, str);

                    bar.tick();
                });

            } else {
                console.log(colors.red('- s_child [0]'));
            }

            var strZipFile = configData.provinceCode + '-' + moment().format('YYYYMMDDHHmmss') + '.zip';
            var zipFile = path.join(config.outboxPath, strZipFile);

            return hdc.createZip(files, zipFile);

        }).then(function (zipFile) {
            console.log(colors.green('Success! '));
            console.log('File ' + colors.red.bold(zipFile) +' was created.');
            console.log('Starting upload file...');

            upload.doUpload(uploadUrl, zipFile)
                .then(function () {
                    console.log(colors.green.blink('Upload file successfully'));
                    process.exit(0);
                }, function (err) {
                    console.log(colors.red(err));
                    process.exit(1);
                });
        }, function (err) {
            console.log(colors.red(err));
        });
    }
};
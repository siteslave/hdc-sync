// Load dependencies module
var fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    colors = require('cli-color'),
    _ = require('lodash'),
    moment = require('moment'),
    Progress = require('progress'),
    request_promise = require('request-promise'),
    request = require('request'),
    yaml = require('yamljs'),
    format = require('string-template')

    http = require('./hdc-http'),
    stdConfig = require('./config'),
    hdcExport = require('./hdc-export');

module.exports = {

    startSync: function (configData, startDate, endDate, kpiYear) {

        var hdc = configData.hdc,
            server = configData.server;

        var password = null;

        if (typeof hdc.password == 'number') {
            password = hdc.password.toString();
        } else {
            password = hdc.password;
        }

        var db = require('knex')({
            client: 'mysql',
            connection: {
                host: hdc.host,
                port: hdc.port,
                database: hdc.database,
                user: hdc.user,
                password: password
            },
            pool: {
                min: 0,
                max: 500
            },
            debug: false
        });

        var uploadUrl = 'http://' + server.address + ':' + server.port + '/upload';
        var sqlUrl = 'http://' + server.address + ':' + server.port + '/files/sql';

        console.log(colors.green('Starting download sql file'));

        http.getSql(sqlUrl)
            .then(function (sql) {
                return sql;
            })
            .then(function (sql) {

                // Start exporting.
                var result = {};
                var target = {};
                var provCode = configData.provCode;

                // Formating SQL
                result.k101 = format(sql.k101.result, {start: startDate, end: endDate, province: provCode});
                target.k101 = format(sql.k101.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                result.k102 = format(sql.k102.result, {start: startDate, end: endDate, province: provCode});
                target.k102 = format(sql.k102.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});
                console.log();
                console.log(colors.green('+----------------------------------------------------------+'));
                console.log(colors.green('+ Starting export...'));
                console.log(colors.green('+----------------------------------------------------------+'));

                var headersResult = [
                    'kpi_id', 'province', 'hospcode', 'result', 's_year', 's_month'
                ].join('|') + '\n';

                var headersTarget = [
                    'kpi_id', 'province', 'hospcode', 'target', 'kpi_year'
                ].join('|') + '\n';

                var resultFile = path.join(configData.exportPath, 'result.txt');
                var targetFile = path.join(configData.exportPath, 'target.txt');
                // Create header
                fs.writeFileSync(resultFile, headersResult);
                fs.writeFileSync(targetFile, headersTarget);

                console.log(colors.blue('* KPI 101'));

                var promise = hdcExport.getResult(db, result.k102);

                promise.then(function (rows) {
                    //dataResult.push(rows[0]);
                    if (rows[0].length) {
                        var total = rows[0].length;
                        var bar = new Progress('\t- result \t\t\t [:current/:total] :percent :etas', {
                            complete: '=',
                            incomplete: ' ',
                            width: '50',
                            total: total
                        });

                        _.forEach(rows[0], function (v) {
                            var obj = {};
                            obj.hospcode = v.hospcode;
                            obj.total = v.total;
                            obj.s_year = v.s_year;
                            obj.s_month = v.s_month;
                            obj.kpi_id = v.kpi_id;
                            obj.province = v.province;

                            var str = [
                                    obj.kpi_id, obj.province, obj.hospcode, obj.total,
                                    obj.s_year, obj.s_month].join('|') + '\n';

                            fs.appendFileSync(resultFile, str);

                            bar.tick();
                        });
                    } else {
                        console.log(colors.red('\t- result [0]'));
                    }

                    return hdcExport.getTarget(db, target.k102);
                })
                .then(function (rows) {

                    if (rows[0].length) {
                        var total = rows[0].length;
                        var bar = new Progress('\t- target \t\t\t [:current/:total] :percent :etas', {
                            complete: '=',
                            incomplete: ' ',
                            width: '50',
                            total: total
                        });

                        _.forEach(rows[0], function (v) {
                            var obj = {};
                            obj.hospcode = v.hospcode;
                            obj.total = v.total;
                            obj.kpi_year = v.kpi_year;
                            obj.kpi_id = v.kpi_id;
                            obj.province = v.province;

                            var str = [
                                    obj.kpi_id, obj.province, obj.hospcode, obj.total,
                                    obj.kpi_year].join('|') + '\n';

                            fs.appendFileSync(targetFile, str);

                            bar.tick();
                        });
                    } else {
                        console.log(colors.red('\t- target [0]'));
                    }

                    console.log(colors.green('+----------------------------------------------------------+'));
                    return;
                })
                .then(function () {

                    console.log('End.');

                    process.exit(0);

                }, function (err) {
                    console.log(err);
                });

/*
                var promise = hdc.kpi117(db, sql101, startDate, endDate, provCode);

                promise.then(function (rows) {

                    fs.writeFileSync(files.result, headers.result);

                    if (rows[0].length) {
                        var total = rows[0].length;
                        //console.log('- s_person_pyramid [%d] ', total);

                        var bar = new Progress('- KPI101 \t\t\t [:current/:total] :percent :etas', {
                            complete: '=',
                            incomplete: ' ',
                            width: '50',
                            total: total
                        });

                        _.forEach(rows[0], function (v) {
                            var obj = {};
                            obj.hospcode = v.hospcode;
                            obj.target = v.target;
                            obj.result = v.result;
                            obj.b_year = null;
                            obj.month = null;
                            obj.kpi_id = v.kpi_id;

                            var str = [
                                    obj.hospcode, obj.target, obj.result,
                                    obj.b_year, obj.momth, obj.kpi_id].join('|') + '\n';

                            fs.appendFileSync(files.kpi117, str);

                            bar.tick();
                        });
                    } else {
                        console.log(colors.red('- KPI101 [0]'));
                    }

                    //return hdc.getAnc(db, startDate, endDate);

                    return;

                }).then(function () {

                    var strZipFile = configData.provinceCode + '-' + moment().format('YYYYMMDDHHmmss') + '.zip';
                    var zipFile = path.join(config.outboxPath, strZipFile);

                    var AdmZip = require('adm-zip'),
                        zip = new AdmZip();

                    zip.addLocalFile(files.kpi117);
                    // zip.addLocalFile(files.anc);
                    // zip.addLocalFile(files.breast_screen);
                    // zip.addLocalFile(files.ca_breast_pop_age);
                    // zip.addLocalFile(files.ca_cervix_pop_age);
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


                    http.doUpload(uploadUrl, zipFile)
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
*/

            });
    }
};

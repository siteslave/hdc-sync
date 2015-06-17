// Load dependencies module
var fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    colors = require('cli-color'),
    _ = require('lodash'),
    moment = require('moment'),
    Progress = require('progress'),
    request = require('request'),
    yaml = require('yamljs'),
    format = require('string-template'),

    http = require('./hdc-http'),
    stdConfig = require('./config'),
    hdcExport = require('./hdc-export');

module.exports = {

    startSync: function (configData, startDate, endDate, kpiYear) {

        var hdc = configData.hdc,
            server = configData.server;

        var password = null;

        //typeof config.dc.host == 'number' ? config.dc.host.toString() : config.dc.host
        var db = require('knex')({
            client: 'mysql',
            connection: {
                host: typeof hdc.host == 'number' ? hdc.host.toString() : hdc.host,
                port: hdc.port,
                database: typeof hdc.database == 'number' ? hdc.database.toString() : hdc.database,
                user: typeof hdc.user == 'number' ? hdc.user.toString() : hdc.user,
                password: typeof hdc.password == 'number' ? hdc.password.toString() : hdc.password
            },
            pool: {
                min: 0,
                max: 1000
            },
            debug: false
        });


        hdcExport.getProvinceCode(db)
            .then(function (provCode) {

            var uploadUrl = 'http://' + server.address + ':' + server.port + '/upload';
            var sqlUrl = 'http://' + server.address + ':' + server.port + '/sql.zip';

            console.log('Download SQL file...');

            http.downloadSQL(sqlUrl)
                .then(function () {
                    var yaml = require('yamljs');
                    var sql = yaml.load('./sql/sql.yaml');
                    //console.log();
                    console.log(colors.blue('+----------------------------------------------------------+'));
                    console.log(colors.blue('+ ') + 'SQL version: ' + colors.red(sql.version));
                    console.log(colors.blue('+ ') + 'SQL Last update: ' + colors.red(sql.updated));
                    console.log(colors.blue('+----------------------------------------------------------+'));

                    var result = {};
                    var target = {};
                    //var provCode = configData.provCode;

                    // Formating SQL
                    result.k101 = format(sql.k101.result, {start: startDate, end: endDate, province: provCode});
                    target.k101 = format(sql.k101.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k102 = format(sql.k102.result, {start: startDate, end: endDate, province: provCode});
                    target.k102 = format(sql.k102.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k103 = format(sql.k103.result, {start: startDate, end: endDate, province: provCode});
                    target.k103 = format(sql.k103.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k104 = format(sql.k104.result, {start: startDate, end: endDate, province: provCode});
                    target.k104 = format(sql.k104.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k105 = format(sql.k105.result, {start: startDate, end: endDate, province: provCode});
                    target.k105 = format(sql.k105.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k107 = format(sql.k107.result, {start: startDate, end: endDate, province: provCode});
                    target.k107 = format(sql.k107.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k108 = format(sql.k108.result, {start: startDate, end: endDate, province: provCode});
                    target.k108 = format(sql.k108.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k205 = format(sql.k205.result, {start: startDate, end: endDate, province: provCode});
                    target.k205 = format(sql.k205.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k208 = format(sql.k208.result, {start: startDate, end: endDate, province: provCode});
                    target.k208 = format(sql.k208.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k209 = format(sql.k209.result, {start: startDate, end: endDate, province: provCode});
                    target.k209 = format(sql.k209.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k210 = format(sql.k210.result, {start: startDate, end: endDate, province: provCode});
                    target.k210 = format(sql.k210.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k211 = format(sql.k211.result, {start: startDate, end: endDate, province: provCode});
                    target.k211 = format(sql.k211.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k220 = format(sql.k220.result, {start: startDate, end: endDate, province: provCode});
                    target.k220 = format(sql.k220.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k221 = format(sql.k221.result, {start: startDate, end: endDate, province: provCode});
                    target.k221 = format(sql.k221.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k223 = format(sql.k223.result, {start: startDate, end: endDate, province: provCode});
                    target.k223 = format(sql.k223.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k224 = format(sql.k224.result, {start: startDate, end: endDate, province: provCode});
                    target.k224 = format(sql.k224.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    result.k229 = format(sql.k229.result, {start: startDate, end: endDate, province: provCode});
                    target.k229 = format(sql.k229.target, {start: startDate, end: endDate, province: provCode, kpiYear: kpiYear});

                    //console.log();
                    //console.log(colors.green('+----------------------------------------------------------+'));
                    console.log(colors.green('Starting export...'));
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

                    console.log(colors.blue('KPI 101'));

                    var promise = hdcExport.getResult(db, result.k101);

                    promise.then(function (rows) {
                        //dataResult.push(rows[0]);
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k101);
                    })
                    .then(function (rows) {

                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        //console.log(colors.green('+----------------------------------------------------------+'));
                        console.log(colors.blue('KPI 102'))
                        return hdcExport.getResult(db, result.k102);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k102);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 103'));
                        return hdcExport.getResult(db, result.k103);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k103);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 104'));
                        return hdcExport.getResult(db, result.k104);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k104);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 105'));
                        return hdcExport.getResult(db, result.k105);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k105);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 107'));
                        return hdcExport.getResult(db, result.k107);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k107);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 108'));
                        return hdcExport.getResult(db, result.k108);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k108);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 205'));
                        return hdcExport.getResult(db, result.k205);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k205);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 208'));
                        return hdcExport.getResult(db, result.k208);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k208);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 209'));
                        return hdcExport.getResult(db, result.k209);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k209);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 210'));
                        return hdcExport.getResult(db, result.k210);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k210);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 211'));
                        return hdcExport.getResult(db, result.k211);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k211);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 220'));
                        return hdcExport.getResult(db, result.k220);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k220);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 221'));
                        return hdcExport.getResult(db, result.k221);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k221);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 223'));
                        return hdcExport.getResult(db, result.k223);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k223);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 224'));
                        return hdcExport.getResult(db, result.k224);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k224);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.blue('KPI 229'));
                        return hdcExport.getResult(db, result.k229);
                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - result \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - result [0]'));
                        }

                        return hdcExport.getTarget(db, target.k229);

                    })
                    .then(function (rows) {
                        if (rows[0].length) {
                            var total = rows[0].length;
                            var bar = new Progress(' - target \t\t\t [:current/:total] \t:percent :etas', {
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
                            console.log(colors.red(' - target [0]'));
                        }

                        console.log(colors.green('+----------------------------------------------------------+'));
                        //console.log(colors.blue('* KPI 229'));
                        return;// hdcExport.getResult(db, result.k229);
                    })
                    .then(function () {

                        var strZipFile = provCode + '-' + moment().format('YYYYMMDDHHmmss') + '.zip';
                        var zipFile = path.join(configData.outboxPath, strZipFile);
                        var AdmZip = require('adm-zip'),
                            zip = new AdmZip();

                        zip.addLocalFile(targetFile);
                        zip.addLocalFile(resultFile);

                        zip.writeZip(zipFile);

                        console.log('File ' + colors.red.bold(zipFile) +' was created.');
                        console.log('Starting upload file.');

                        http.doUpload(uploadUrl, zipFile, provCode)
                            .then(function () {
                                console.log();
                                console.log(colors.green.blink('Upload and Import Successfully.'));
                                process.exit(0);
                            }, function (err) {
                                console.log();
                                console.log(colors.red.blink('FAILED'));
                                console.log();
                                console.log(colors.red(err));

                                process.exit(1);
                            });

                    }, function (err) {
                        console.log(err);
                        process.exit(1);
                    });

                }, function (err) {
                    console.log(err);
                    process.exit(1);
                });

            }, function (err) {

            });
    }
};

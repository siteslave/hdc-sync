var Q = require('q');

module.exports = {

    getResult: function (db, sql) {

        var q = Q.defer();

        var sql = sql.toString();

        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    },

    getTarget: function (db, sql) {

        var q = Q.defer();

        var sql = sql.toString();

        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    },

    getProvinceCode: function (db) {

        var q = Q.defer();

        db('sys_config')
            .select('provincecode')
            .then(function (rows) {
                q.resolve(rows[0].provincecode);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    },

    // create zip file
    createZip: function (files, zipFile) {

        var AdmZip = require('adm-zip'),
            zip = new AdmZip(),
            q = Q.defer();

        try {
            //zip.addLocalFile(files.personPyramid);
            zip.addLocalFile(files.kpi117);
            //zip.addLocalFile(files.child);

            zip.writeZip(zipFile);

            q.resolve(zipFile);
        } catch (err) {
            q.reject(err);
        }

        return q.promise;

    }
};

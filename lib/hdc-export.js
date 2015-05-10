var Q = require('q');

module.exports = {

    getPersonPyramid: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_person_pyramid WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    },

    getAnc: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_anc WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getBreastScreen: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_breast_screen WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getCaBreastPopAge: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_ca_breast_pop_age WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getCaCervixPopAge: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_ca_cervix_pop_age WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getCaLungPopAge: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_ca_lung_pop_age WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getCard: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_card WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getCervixScreen: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_cervix_screen WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;

    },

    getChild: function (db, year) {

        var q = Q.defer();
        var sql = 'SELECT * FROM s_child WHERE b_year=?';

        db.raw(sql, [year])
            .then(function (rows) {
                q.resolve(rows);
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
            zip.addLocalFile(files.personPyramid);
            zip.addLocalFile(files.anc);
            zip.addLocalFile(files.breast_screen);
            zip.addLocalFile(files.ca_breast_pop_age);
            zip.addLocalFile(files.ca_cervix_pop_age);
            zip.addLocalFile(files.ca_lung_pop_age);
            zip.addLocalFile(files.cervix_screen);
            zip.addLocalFile(files.child);

            zip.writeZip(zipFile);

            q.resolve(zipFile);
        } catch (err) {
            q.reject(err);
        }

        return q.promise;

    }
};
var Q = require('q');

module.exports = {
    importPersonPyramid: function (db, file) {
        var q = Q.defer();

        var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE s_person_pyramid FIELDS ' +
            'TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
            '(hospcode, areacode, date_com, b_year, groupcode, groupname, ' +
            'male, female, total)';

        db.raw(sql, [file])
            .then(function () {
                return q.resolve();
            })
            .catch(function (err) {
                return q.reject(err);
            });

        return q.promise;
    },

    importAnc: function (db, file) {
        var q = Q.defer();

        var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE s_anc FIELDS ' +
            'TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
            '(hospcode, areacode, date_com, b_year, target, result, result01, result02, ' +
            'result03, result04, result05, result06, result07, result08, result09, result10,' +
            'result11, result12)';

        db.raw(sql, [file])
            .then(function () {
                return q.resolve();
            })
            .catch(function (err) {
                return q.reject(err);
            });

        return q.promise;
    },

    importBreastScreen: function (db, file) {
        var q = Q.defer();

        var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE s_breast_screen FIELDS ' +
            'TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
            '(hospcode, areacode, date_com, b_year, target, result)';

        db.raw(sql, [file])
            .then(function () {
                return q.resolve();
            })
            .catch(function (err) {
                return q.reject(err);
            });

        return q.promise;
    }
};
var Q = require('q'),
    moment = require('moment');

module.exports = {

    result: function (db, file) {
        var q = Q.defer();

        var sql = `
            LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE results FIELDS
            TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS
            (kpi_id, province, hospcode, total, s_year, s_month, @updated_at) SET updated_at=NOW()`;
            //kpi_id|province|hospcode|result|s_year|s_month
        db.raw(sql, [file])
            .then(function () {
                q.resolve();
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    },

    target: function (db, file) {
        var q = Q.defer();

        var sql = `
            LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE targets FIELDS
            TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS
            (kpi_id, province, hospcode, total, kpi_year, @updated_at) SET updated_at=NOW()`;
            //kpi_id|province|hospcode|target|kpi_year
        db.raw(sql, [file])
            .then(function () {
                q.resolve();
            })
            .catch(function (err) {
                q.reject(err);
            });

        return q.promise;
    }
};

var Q = require('q');

module.exports = {
    kpi117: function (db, file) {
        var q = Q.defer();

        var sql = `
        LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE kpis FIELDS
            TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS
            (hospcode, target, result, year, month, kpi_id)`;

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

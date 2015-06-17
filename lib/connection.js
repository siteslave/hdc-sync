
var Q = require('q');
var request = require('request');

module.exports = {
    testHDCConnection: function (hdc) {

        var q = Q.defer();
        // Test HDC Connection
        var db = require('knex')({
            client: 'mysql',
            connection: {
                host: typeof hdc.host == 'number' ? hdc.host.toString() : hdc.host,
                port: hdc.port,
                user: hdc.user,
                database: hdc.database,
                password: typeof hdc.password == 'number' ? hdc.password.toString() : hdc.password
            }
        });

        db.raw('SELECT * FROM sys_config')
            .then(function () {
                q.resolve(true);
            })
            .catch(function (err) {
                //console.log(err);
                q.resolve(false);
            });

        return q.promise;

    },

    testServerConnection: function (url) {
        var q = Q.defer();

        request.get(url, function (err, res) {
            if (!err && res.statusCode == 200) {
                q.resolve(true);
            } else {
                q.resolve(false);
            }
        });

        return q.promise;
    }
};

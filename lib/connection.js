
var Q = require('q');
var request = require('request');

module.exports = {
    testHDCConnection: function (config) {

        var q = Q.defer();
        // Test HDC Connection
        var db = require('knex')({
            client: 'mysql',
            connection: {
                host: config.address,
                port: config.port,
                user: config.user,
                database: config.database,
                password: config.password
            }
        });

        db('sys_config')
            .select()
            .then(function () {
                q.resolve(true);
            })
            .catch(function (err) {
                console.log(err);
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
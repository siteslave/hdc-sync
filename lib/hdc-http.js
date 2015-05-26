
var request = require('request');
var request_promise = require('request-promise');
var fs = require('fs');
var colors = require('cli-color');
var Q = require('q');


module.exports = {

    doUpload: function (url, file) {

        var q = Q.defer();

        var formData = {
            file: fs.createReadStream(file)
        };

        request.post({
            url: url,
            formData: formData
        }, function (err) {
            if (err) q.reject(err);
            else q.resolve();
        });

        return q.promise;

    },

    getSql: function (url) {
        var q = Q.defer();

        request_promise(url)
            .then(function (res) {
                var data = JSON.parse(res);
                q.resolve(data.sql);
            })
            .catch(function (err) {
                console.log(err);
                q.reject(err);
            });

        return q.promise;
    }

};

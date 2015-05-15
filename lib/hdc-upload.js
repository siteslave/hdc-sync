
var request = require('request');
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

    }

};

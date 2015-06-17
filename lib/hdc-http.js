
var request = require('request');
var fs = require('fs');
var colors = require('cli-color');
var Q = require('q');


module.exports = {

    doUpload: function (url, file, province) {

        var q = Q.defer();

        var formData = {
            province: province,
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

    downloadSQL: function (url) {
        var q = Q.defer();

        var Download = require('download');
        //var progress = require('download-status');

        var download = new Download({extract: true})
            .get(url)
            .dest('sql')
            //.use(progress())
            .run(function (err) {
            if (err) {
                q.reject(err);
            }

            q.resolve();
        });

        return q.promise;
    }

};

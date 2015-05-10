var request = require('request');
var fs = require('fs');

var formData = {
    file: fs.createReadStream('/var/tmp/hdc-sync/outbox/20150509160001.zip')
};

request.post({
    url: 'http://127.0.0.1:8888/upload',
    formData: formData
}, function (err, res, body) {
    if (err) {
        return console.log('Upload failed: ', err);
    }
    console.log('Upload success', body);
});
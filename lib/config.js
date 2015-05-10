var jf = require('jsonfile');

var Config = {
    getConfig: function (file) {
        var config = jf.readFileSync(file);

        return config;
    }
};

module.exports = Config;
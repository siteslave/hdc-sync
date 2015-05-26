var yaml = require('yamljs'),
    path = require('path');

var Config = {
    getConfig: function (file) {
        var config = yaml.load(file);
        return config;
    },

    getHeaders: function () {

        var headers = {};

        headers.result = [
            'kpi_id', 'province', 'hospcode', 'result', 's_year', 's_month'
            ].join('|') + '\n';
        var headers = {};

        headers.target = [
            'kpi_id', 'prov_code', 'hospcode', 'target', 'kpi_year'
            ].join('|') + '\n';

        return headers;
    },

    getFiles: function (config) {
        var files = {};
        files.result = path.join(config.exportPath, 'result.txt');
        files.target = path.join(config.exportPath, 'target.txt');

        return files;
    }
};

module.exports = Config;

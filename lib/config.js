var jf = require('jsonfile');
var path = require('path');

var Config = {
    getConfig: function (file) {
        var config = jf.readFileSync(file);
        return config;
    },

    getHeaders: function () {

        var headers = {};

        headers.personPyramid = [
            'hospcode', 'areacode', 'date_com', 'b_year', 'groupcode', 'groupname', 'male', 
            'female', 'total'
            ].join('|') + '\n';

        headers.anc = [
            'hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result', 'result01', 
            'result02', 'result03', 'result04', 'result05', 'result06', 'result07', 'result08', 
            'result09', 'result10', 'result11', 'result12'
            ].join('|') + '\n';

        headers.breast_screen = ['hospcode', 'areacode', 'date_com', 'b_year', 'target', 'result'].join('|') + '\n';

        headers.ca_breast_pop_age = [
                'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
            ].join('|') + '\n';

        headers.ca_cervix_pop_age = [
                'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
            ].join('|') + '\n';

        headers.ca_lung_pop_age = [
                'hospcode', 'areacode', 'date_com', 'b_year', 'pop_group1', 'result_group1',
                'pop_group2', 'result_group2', 'pop_group3', 'result_group3',
                'pop_group4', 'result_group4', 'pop_group5', 'result_group5'
            ].join('|') + '\n';


        return headers;
    },

    getFiles: function (config) {
        var files = {};
        files.personPyramid = path.join(config.exportPath, 's_person_pyramid.txt');
        files.anc = path.join(config.exportPath, 's_anc.txt');
        files.breast_screen = path.join(config.exportPath, 's_breast_screen.txt');
        files.ca_breast_pop_age = path.join(config.exportPath, 's_ca_breast_pop_age.txt');
        files.ca_cervix_pop_age = path.join(config.exportPath, 's_ca_cervix_pop_age.txt');
        files.ca_lung_pop_age = path.join(config.exportPath, 's_ca_lung_pop_age.txt');

        return files;
    }
};

module.exports = Config;
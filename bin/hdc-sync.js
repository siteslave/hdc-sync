#!/usr/bin/env node

'use strict';

// Get argvs;
var argv = require('minimist')(process.argv.slice(2));
// Main Sync program
var Sync = require('../lib/hdc-sync');

//console.dir(argv);

// Show help
if (argv.help) {

}

// Set display log to console
if (argv.console) {

}

// Test connection
if (argv.test) {
    Sync.testConnection();
}

// Running server mode
if (argv.server) {
    console.log('Listening on port: 3333');
}

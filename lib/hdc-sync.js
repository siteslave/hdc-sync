
var Sync = {

    setConsole: true,
    // Test configuration
    testConnection: function () {
        console.log('Testing connection');
    },

    // Synchronize data
    syncData: function () {},

    // Show help
    help: function () {
        console.log([
            "usage: hdc-sync [options]",
            "",
            "options:",
            "  --server --host 0.0.0.0 --port 8080   Run with server mode",
            "  --help                                Show command list",
            "  --config <file>                       Configuration file",
            "  --sync                                Synchronize data",
            ""
        ].join('\n'));

        process.exit();
    }

};

module.exports = Sync;
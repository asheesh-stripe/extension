module.exports = function(grunt) {
    'use strict';

    var ff = grunt.config('shared.firefox');
    var pathToXpiReleaseFile = ff.path + ff.file;

    return {
        'sign-xpi': {
            command: [
                'rm -f ' + pathToXpiReleaseFile,
                'mkdir ' + ff.path,
                'xpisign -k ./certs/code_signing/key.pem ./build/mailfred.xpi ' + pathToXpiReleaseFile
            ].join(' && ')
        },
        "update-xpi": {
            "options": {
                "stderr": false,
                "failOnError": false
            },
            // for this to work
            // https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/
            // must be installed in the Firefox you are using
            "command": "wget --post-file=build/mailfred.xpi http://localhost:8888/"
        },
        'update-max-version-cfx': {
            command: './updateInstallRdf.js'
        },
        "update-rdf": {
            command: 'tmp/mxtools/uhura' +
            ' -o build/firefox/update.rdf' +
            ' -m' +
            ' -k certs/firefox/updateRdfKeyFile.pem' +
            ' ' + pathToXpiReleaseFile +
            ' http://extension.mailfred.de/firefox/' + ff.file +
            ' firefox/appvers.txt'
        },
        "generate-htaccess": {
            command: 'echo "Redirect /firefox/latest /firefox/' + ff.file + '" > ' + ff.path + '.htaccess'
        }
    };
};

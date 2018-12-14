var JTR = require('jasmine-terminal-reporter');
var reporter = new JTR({
    "isVerbose": true
});

jasmine.getEnv().addReporter(reporter);

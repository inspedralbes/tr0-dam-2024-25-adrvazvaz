var spawn = require("child_process").spawn;

var process = spawn('python',["./hello.py", "Pol", "Prats"]);

process.stdout.on('data', function(data) {
    console.log(data.toString());
} )
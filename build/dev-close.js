const ppid = require("./dev-server").pid
console.log(ppid);
process.kill(ppid)

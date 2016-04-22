var opener = require('opener');


const internalPort = 32102;
const server = require('./server');
server.enableDebug();
server.start("./", internalPort, () => {
	opener('http://localhost:' + internalPort + '/');
});

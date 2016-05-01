//jshint esversion:6

var opener = require('opener');


const internalPort = 32102;
const server = require('./server');
server.start("./", internalPort, () => {
	opener('http://localhost:' + internalPort + '/');
}, true);

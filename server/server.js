var storage = require('./storage.js');

console.log("starting server");

exports.enableDebug = function () {
	storage.enableDebug();
};

exports.start = function (staticDir, internalPort, cb) {
	var express = require('express');
	var bodyParser = require('body-parser');
	var app = express();

	// console.log('storage dir : ', storageDir);

	app.use('/', express.static(staticDir));
	app.use(bodyParser.json());

	app.get('/api/load', function (req, res) {
		var id = req.query.id;
		storage.load(id, (data) => {
			res.end(data);
		});
	});

	app.post('/api/save', function (req, res) {
		var id = req.query.id;
		var data = req.body;
		storage.save(id, data, () => {
			res.end();
		});
		// console.log(req.query);

	});

	app.delete('/api/delete', function (req, res) {
		var data = req.body;
		var id = data.id;
		storage.delete(id, (err) => {
			res.end();
		});
	});

	app.listen(internalPort, function () {
		console.log('Internal server running @' + internalPort);
		if(cb){
			cb();
		}
	});
};

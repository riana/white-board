console.log("starting server");

var os = require('os');
var fs = require("fs");
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
console.log('user home dir : ' + os.homedir());

var storageDir = os.homedir() + "/.whiteboard-app/data/";

function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err);

		fs.writeFile(path, contents, cb);
	});
}

exports.enableDebug = function () {
	storageDir = "./.whiteboard-app/data/";
};

exports.start = function (staticDir, internalPort) {
	var express = require('express');
	var bodyParser = require('body-parser')
	var app = express();

	console.log('storage dir : ', storageDir);

	app.use('/', express.static(staticDir));
	app.use(bodyParser.json());

	app.get('/api/load', function (req, res) {
		var id = req.query.id;
		var filename = storageDir + id + ".json";
		console.log("loading : ", filename);
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err && err.code === "ENOENT") {
				res.end(JSON.stringify({
					error: "Data not found"
				}));
			} else {
				res.end(data);
			}

		});
	});

	app.post('/api/save', function (req, res) {
		var id = req.query.id;
		// console.log(req.query);
		var outputFilename = storageDir + id + ".json";
		var data = req.body;
		writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("JSON saved to " + outputFilename);
			}
			res.end();
		});
	});

	app.listen(internalPort, function () {
		console.log('Internal server running @' + internalPort);
	});
};

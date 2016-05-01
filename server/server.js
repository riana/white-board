//jshint esversion:6

var storage = require('./storage.js');
var mkdirp = require('mkdirp');
var fs = require("fs");

var tmpUpload = './.tmp-uploads';
console.log("starting server");

mkdirp(tmpUpload, function (err) {
	if (err) return cb(err);
	console.log("temporary upload dir created");
});

exports.start = function (staticDir, internalPort, cb, debug) {
	var express = require('express');
	var bodyParser = require('body-parser');
	var multer = require('multer');
	var upload = multer({
		dest: tmpUpload,
		limits: {
			fileSize: 10000000,
			files: 1
		} //10 Mega max
	});

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

	app.get('/api/media', function (req, res) {
		var path = req.query.path;
		storage.loadMedia(path, (meta, data) => {
			// console.log("Media loaded : ", meta, data);
			if (meta.err) {
				return res.end(404);
			}

			// http://localhost:32102/api/media?path=76961778-f4b3-f11e-ad7a-daac0fbba1ce/1bab0f08-59e4-ea30-3112-15bdefc73cf1
			res.writeHead(200, {
				'Content-Type': meta.type
			});
			res.end(data);
		});
	});

	app.post('/api/media', upload.single('file'), function (req, res) {
		var tmpFile = req.file.path;
		var type = req.file.mimetype;
		var originalName = req.file.originalname;
		var targetPath = req.query.path;
		fs.readFile(tmpFile, function (err, data) {
			if (err) {
				return res.end(500);
			}
			var meta = {
				type: type,
				originalName: originalName
			};
			// console.log("save media type of : ", typeof(data));
			storage.saveMedia(targetPath, data, meta, (err) => {
				fs.unlink(tmpFile, function (err) {
					if (err) {
						return res.end(500);
					}
					return res.end();

				});
			});
		});
	});

	app.delete('/api/media', function (req, res) {
		var path = req.query.path;
		storage.deleteMedia(path, (err) => {
			res.end();
		});
	});

	storage.open(()=> {
		app.listen(internalPort, function () {
			console.log('Internal server running @' + internalPort);
			if (cb) {
				cb();
			}
		});
	}, debug);
};

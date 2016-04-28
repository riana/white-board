var os = require('os');
var fs = require("fs");
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
console.log('user home dir : ' + os.homedir());

var storageDir = os.homedir() + "/.whiteboard-app/data/";
var mediaDir = os.homedir() + "/.whiteboard-app/media/";
function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err);

		fs.writeFile(path, contents, cb);
	});
}

exports.enableDebug = function () {
	storageDir = "./.whiteboard-app/data/";
	mediaDir = "./.whiteboard-app/media/";
};


exports.load = function (path, cb) {
	console.log("Load from electron");
	var filename = storageDir + path + ".json";
	console.log("loading : ", filename);
	fs.readFile(filename, 'utf8', function (err, data) {
		if (err && err.code === "ENOENT") {
			cb(JSON.stringify({
				error: "Data not found"
			}));
		} else {
			cb(data);
		}

	});
};

exports.save = function (path, data, cb) {
	console.log("Save from electron");
	var outputFilename = storageDir + path + ".json";
	writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + outputFilename);
		}
		cb();
	});
};

exports.delete = function (path, cb) {
	var filename = storageDir + path + ".json";
	console.log("Delete from electron : ", filename);
	fs.unlink(filename, function (err) {
		if (err) {
			cb(err);
		} else {
			cb();
		}
	});
};

exports.saveMedia = function (targetPath, data, meta, cb) {
	var path = mediaDir + targetPath;
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err);

		writeFile(path + '.json', JSON.stringify(meta, null, 4), function (err) {
			if (err) {
				return cb(err);
			} else {
				writeFile(path, data, function (err) {
					if (err) {
						return cb(err);
					}
					cb();
				});
			}
		});
	});
};

exports.loadMedia = function (path, cb) {
	// meta, data, err
	var targetPath = mediaDir + path;
	fs.readFile(targetPath + '.json', 'utf8', function (err, data) {
		if (err && err.code === "ENOENT") {
			cb(JSON.stringify({
				err: "Data not found"
			}));
		} else {
			var meta = JSON.parse(data);
			fs.readFile(targetPath, function (err, data) {
				if (err && err.code === "ENOENT") {
					cb(JSON.stringify({
						err: "Data not found"
					}));
				} else {
					cb(meta, data);
				}
			});
		}
	});

};

exports.deleteMedia = function (path, cb) {
	var targetPath = mediaDir + path;
	fs.unlink(targetPath + '.json', function (err) {
		var success = true;
		if (err) {
			success = false;
		}
		fs.unlink(targetPath, function (err) {
			if (!err && success) {
				cb();
			} else {
				cb(err);
			}
		});
	});
};

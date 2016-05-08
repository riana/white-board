//jshint esversion:6

var os = require('os');
var fs = require("fs");
var mkdirp = require('mkdirp');
var Datastore = require('nedb');
var getDirName = require('path').dirname;
console.log('user home dir : ' + os.homedir());

var storageDir = os.homedir() + "/.whiteboard-app/data/";
var mediaDir = os.homedir() + "/.whiteboard-app/media/";

var mediaLibraryIndex = null;

function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err);

		fs.writeFile(path, contents, cb);
	});
}

exports.open = function (cb, debug) {
	if (debug) {
		storageDir = "./.whiteboard-app/data/";
		mediaDir = "./.whiteboard-app/media/";
	}

	mediaLibraryIndex = new Datastore({
		filename: storageDir + '/media-library.db'
	});
	mediaLibraryIndex.loadDatabase(function (err) {
		console.log("Media library loaded");
		cb();
	});
};


exports.load = function (path, cb) {
	var filename = storageDir + path + ".json";
	// console.log("loading : ", filename);
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

generateUUID = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
};

exports.addToMediaLibrary = function (meta, path, cb) {
	var id = generateUUID();
	var targetPath = mediaDir + 'library/' + id;
	meta.id = id;
	meta.insertionDate = (new Date()).now;
	mediaLibraryIndex.insert(meta, () => {
		fs.readFile(path, function (err, data) {
			writeFile(targetPath, data, function (err) {
				if (err) {
					return cb(err);
				}
				cb();
			});
		});
	});
};

exports.getMediaLibraryContent = function (regexp, cb) {
	mediaLibraryIndex.find({
		type: regexp
	}, function (err, docs) {
		cb(err, docs);
	});
};

exports.deleteFromLibrary = function (id, cb) {
	var targetPath = mediaDir + 'library/' + id;
	fs.access(targetPath, fs.W_OK, (err) => {
		if(!err){
			fs.unlink(targetPath, function (err) {
				if (err) {
					// TODO Handle error
				}
				// TODO Handle success
			});
		}
	});

	mediaLibraryIndex.remove({
		id: id
	}, {}, function (err, numRemoved) {
		cb(err, numRemoved);
	});
};

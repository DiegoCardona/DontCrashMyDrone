var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var multer = require('multer');

var app = express();

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './integrations/news');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({
	storage: storage
}).single('userPhoto');

app.post('/api/uploads', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});

mongoose.connect('mongodb://localhost:27017/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

var req = request.post(url, function(err, resp, body) {
	if (err) {
		console.log('Error!');
	} else {
		console.log('URL: ' + body);
	}
});
var form = req.form();
form.append('file', '<FILE_DATA>', {
	filename: 'myfile.txt',
	contentType: 'text/plain'
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

module.exports = app;

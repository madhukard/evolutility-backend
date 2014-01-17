var express = require('express'),
	path	= require('path'),
	http	= require('http'),
	tasks = require('./tasks');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/tasks', tasks.findAllTasks);
app.get('/tasks/:id', tasks.findTaskById);
app.post('/tasks', tasks.addTask);
app.put('/tasks/:id', tasks.updateTask);
app.delete('/tasks/:id', tasks.deleteTask);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Evolutility server listening on port " + app.get('port'));
});
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('tasks', server);
db.open(function(err, client) {
    populateDB();
});

exports.findTaskById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving task: ' + id);
    db.collection('tasks', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllTasks = function(req, res) {
    db.collection('tasks', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addTask = function(req, res) {
    var story = req.body;
    console.log('Adding story: ' + JSON.stringify(story));
    db.collection('tasks', function(err, collection) {
        collection.insert(story, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateTask = function(req, res) {
    var id = req.params.id;
    var story = req.body;
    delete story._id;
    console.log('Updating story: ' + id);
    console.log(JSON.stringify(story));
    db.collection('tasks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, story, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating story: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(story);
            }
        });
    });
};

exports.deleteTask = function(req, res) {
    var id = req.params.id;
    console.log('Deleting story: ' + id);
    db.collection('tasks', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};



/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var sampleTasks = [
        {id: '322', title: 'Test', duedate: "03/01/2013", priority: '2', category: 'others', complete: false, notes: ''},
        {id: '304', title: 'Another task', duedate: "03/01/2013", priority: '3', category: 'work', complete: false, notes: 'bla bla'},
        {id: '335', title: 'Testing App', duedate: "03/01/2013", priority: '3', category: 'work', complete: false, notes: 'test'},
        {id: '343', title: 'Demo Task', duedate: "03/01/2013", priority: '1', category: 'work', complete: false, notes: 'Check this out'},
        {id: '344', title: 'Test done', duedate: "03/01/2013", priority: '5', category: 'misc', complete: true, notes: 'notes for my test todo task\nthis is pretty nice with different fonts.\n\n,,'},
        {id: '345', title: 'Teste do meu TODO', duedate: "03/01/2013", priority: '2', category: 'misc', complete: false, notes: 'teste'},
        {id: '346', title: 'Car wash', duedate: "03/01/2013", priority: '4', category: 'work', complete: false, notes: ''},
        {id: '347', title: 'Watch Inception', duedate: "03/01/2013", priority: '5', category: 'fun', complete: false, notes: ''},
        {id: '348', title: 'Test TODO', duedate: "03/01/2013", priority: '1', category: 'work', complete: true, notes: 'Test TODO '}
    ];

    db.collection('tasks', function(err, collection) {
        collection.insert(sampleTasks, {safe:true}, function(err, result) {});
    });

};
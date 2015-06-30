var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('localhost:27017/hw3');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());


app.get('/', function(req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var Mentors = mongoose.model('Mentors', {
    name: String,
    surname: String,
    phone: Number,
    email: String,
    mentees: [String]
});

var Mentees = mongoose.model('Mentees', {
    name: String,
    surname: String,
    phone: Number,
    email: String,
    mentor: Boolean
});

app.get('/api/mentors', function (req, res) {
    Mentors.find(function (err, mentors) {
        if (err)
            res.send(err)

        res.json(mentors);
    });
});


app.get('/api/mentees', function (req, res) {
    Mentees.find(function (err, mentees) {
        if (err)
            res.send(err)

        res.json(mentees);
    });
});

app.post('/api/mentors', function (req, res) {

    Mentors.create({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        email: req.body.email
    }, function (err, mentor) {
        if (err)
            res.send(err);
    });

});


app.post('/api/mentees', function (req, res) {

    Mentees.create({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        email: req.body.email
    }, function (err, mentee) {
        if (err)
            res.send(err);
    });

});

app.delete('/api/mentor/:id', function(req, res) {
    Mentors.findById(req.params.id, function (err, mentor) {
        if (mentor && mentor.mentees) {
            mentor.mentees.forEach(function (item) {
                Mentees.findById(item, function (err, mentee) {
                    if (err)
                        res.send(err);

                    mentee.mentor = false;

                    mentee.save(function (err) {
                        if (err)
                            res.send(err);
                    });

                });
            });
        }

        Mentors.remove({
            _id : req.params.id
        }, function(err, mentor) {
            if (err)
                res.send(err);
        });
    });


});

app.delete('/api/mentee/:id', function(req, res) {
    var _id = req.params.id;
    Mentees.remove({
        _id : _id
    }, function(err, mentee) {
        if (err)
            res.send(err);

    });

    Mentors.find({"mentees": _id}, function (err, mentors) {
        if (err)
            res.send(err);

        else {
            if (mentors && mentors[0] && mentors[0].mentees) {
                mentors[0].mentees = mentors[0].mentees.filter(function(item){
                    return item!== _id;
                });

                mentors[0].save(function (err) {
                    if (err)
                        res.send(err);
                });
            }
        }
    });
});

app.put('/api/mentor/:id',function(req, res) {

    Mentors.findById(req.params.id, function (err, mentor) {
        if (err)
            res.send(err);

        mentor.mentees.push(req.body.menteeId);

        mentor.save(function (err) {
            if (err)
                res.send(err);
        });
    });

    Mentees.findById(req.body.menteeId, function (err, mentee) {
        if (err)
            res.send(err);

        mentee.mentor = true;

        mentee.save(function (err) {
            if (err)
                res.send(err);
        });

    });
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
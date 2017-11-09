var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var users = require('./users')
var app = express();

var MongoClient = require('mongodb').MongoClient

/* Body Parser Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
/* Path for static content: Angular, Vue.js, html, js, css */
// Create 'index.html' file inside the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/* setup view engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

MongoClient.connect('mongodb://pailinnnnnnnnn:Klaw5236@ds243055.mlab.com:43055/pailin_405_api', function (err, db) {
    if (err) throw err


    /* handle GET request */
    app.get('/', function (req, res) {
        db.collection('customers').find().toArray(function (err, result) {
            if (err) throw err

            res.render('index', {
                title: 'Customer List:',
                users: result
            })
        })
    });
    app.get('/user', function (req, res) {
        db.collection('customers').find().toArray(function (err, result) {
            if (err) throw err
            res.json(result)
        })
    });
    app.get('/user/:id', function (req, res) {
        db.collection('customers').find({
            'id': req.params.id
        }).toArray(function (err, result) {
            if (err) throw err
            res.json(result)
        })
    });

    /* handle POST request */
    app.post('/user', function (req, res) {
        var newUser = {
            id: req.body.id,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        }
        db.collection('customers').insert(newUser, function (err, doc) {
            if (err) throw err
            // console.log(doc);
            res.redirect('/')
        })
    });

    /* handle PUT request */
    app.put('/user/:id', function (req, res) {
        // console.log(req);
        db.collection('customers').findAndModify(
            {
                id: req.params.id
            },
            [['_id','asc']],
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email
                }
            },
            { new: true }
        , function (err, doc, lastErrorObject) {
            // doc.age === 25
            if (err) console.log(err)
            res.send('Updated !')
        });
    });

    /* handle DELETE request */
    app.delete('/user/:id', function (req, res) {
        db.collection('customers').remove({
            id: req.params.id
        }, function (err, result) {
            res.send('Deleted !')
        })
    });

    app.listen(3000, function () {
        console.log('Server Started on Port 3000...');
    })
})
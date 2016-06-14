var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaders = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')

//.all smo izbrisali, on se ovdje ne koristi
.get(function (req, res, next) {
    Leaders.find({}, function (err, leader) {
        if (err) throw err;
        res.json(leader); //vratit ce u json formatu
    });
})

.post(function (req, res, next) {
//na ovaj nacin dodajemo novi Item u Kolekciju
    Leaders.create(req.body, function (err, leader) {
        if (err) throw err;
        console.log('Leader created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})

.delete(function (req, res, next) {
    Leaders.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
}); //ovo ';' ide samo na kraju ROUTE-a


//Drugi Route
leaderRouter.route('/:leaderId')

.get(function (req, res, next) {
    Leaders.findById(req.params.leaderId, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.put(function (req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
//body bi trebao imati updejte
        $set: req.body
    }, {
//collback funkcija ce vratiti updejtani dish
        new: true
    }, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.delete(function (req, res, next) {
    Leaders.findByIdAndRemove(req.params.leaderId, function (err, resp) {        
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = leaderRouter;

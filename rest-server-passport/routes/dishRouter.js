var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
//dodali da provjeravamo korisnika
var Verify = require('./verify'); 

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')

//.all smo izbrisali, on se ovdje ne koristi
//Provjeravamo korisnika na ovoj route
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
// Prije nego vratimo sve Dish, prvo populate informations    
Dishes.find({})
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish); //vratit ce se u JSON formatu
    });
})


//Body of messege sadrzi novi dish u JSON formatu (req.body)
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
//na ovaj nacin dodajemo novi Item u Kolekciju
    Dishes.create(req.body, function (err, dish) {
        if (err) throw err;
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})


.put(function (req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
//body bi trebao imati updejte
        $set: req.body
    }, {
//collback funkcija ce vratiti updejtani dish
        new: true
    }, function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})

.delete(function (req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {        
        if (err) throw err;
        res.json(resp);
    });
});


//Handling Comments

dishRouter.route('/:dishId/comments')
//za sve get, post, deleti User mora biti verificiran
.all(Verify.verifyOrdinaryUser)
//Dobit cemo sve komentare za taj Dish
//findById nade taj i taj dish po dishID i vrati comentar od tog disha
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish.comments);
    });
})


//Naci ce taj dish i u njega Push comentar(req.body) i nakon toga save promjenu
.post(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        
// postedBy = id of User
// sada ce se automatski uz komentar postat i user ID
        req.body.postedBy = req.decoded._doc._id;

        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

//Remove nije podrzan u arrayu, pa koristimo findById
//For Petlja vrti svaki Comment po ID i brisega, ispod sejvamo promjene
.delete(Verify.verifyAdmin, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)
//Dobit cemo odredeni komentar za taj Dish
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish.comments.id(req.params.commentId));
    });
})


.put(function (req, res, next) {
    // Nademo taj komentar, izbrisemo ga, updejtamo novi i save
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        
// postedBy = id of User
// sada ce se automatski uz komentar postat i user ID
        req.body.postedBy = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
//Dozvoljavamo da User moze brisati samo svoje komentare
        if (dish.comments.id(req.params.commentId).postedBy
           != req.decoded._doc._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }

        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = dishRouter;

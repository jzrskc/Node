// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //ne mogu biti 2 disha u DB s istim imenom
    },
    description: {
        type: String,
        required: true
    }
}, {
//zapis kada je napravljen i updejtan
    timestamps: true
});

// we need to create a model using it
// Dishes je kolekcija i uvijek je mnozina
var Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node applications
module.exports = Dishes;

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL, connect to DB Server
var url = 'mongodb://localhost:27017/conFusion';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
//Provjeravamo ima li greske, ako ne idemo dalje
    assert.equal(err,null);
    console.log("Connected correctly to server");

//Pravimo jednu Kolekciju (dishes), i u nju dodajemo jedan dokument
//Ispod je CallBack funkcija
        var collection = db.collection("dishes");
        collection.insertOne({name: "Uthapizza", description: "test"}, 
		function(err,result){
        		assert.equal(err,null);
        		console.log("After Insert:");
        		console.log(result.ops);//print inserted docs

//Print all docs of collection
                collection.find({}).toArray(function(err,docs){
           	 	assert.equal(err,null);
            		console.log("Found:");
            		console.log(docs);
                    

//Odbacivanje svih promjena, restore
//Brisemo kolekciju dishes, samo iz razloga da je mozemo vise puta pozivati
                db.dropCollection("dishes", function(err, result){
               		assert.equal(err,null);
               		db.close();
           	 });
        });
            });
});

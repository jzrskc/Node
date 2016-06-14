var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dboper = require('./operations');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

// 1.db, 2.document kreiramo, 3.collection, 4.callback
    dboper.insertDocument(db, { name: "Vadonut", description: "Test" },
        "dishes", function (result) {
            console.log(result.ops); //print inserted docs

//Prikazat ce sve dokumente iz collection „dishes“
            dboper.findDocuments(db, "dishes", function (docs) {
                console.log(docs);

//Updejtat cemo dokument u kolekciji dishes
// 1.db, 2.doc koji cemo updejtat, 3.update, 4.collection, 5.callback
                dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" },
                    "dishes", function (result) {
                        console.log(result.result);//print rezultate

//provjeravamo je li Update ispravno izvrsen
                        dboper.findDocuments(db, "dishes", function (docs) {
                            console.log(docs)

//Brisemo kolekciju dishes, samo iz razloga da je mozemo vise puta pozivati
                            db.dropCollection("dishes", function (result) {
                                console.log(result);

                                db.close();
                            });
                        });
                    });
            });
        });
});

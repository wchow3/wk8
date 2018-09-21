const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'mydb';

MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to the server");

    const db = client.db(dbName);

    insertProducts(db, function() {
        removeProducts(db, function(){
            updateProducts(db, function(){
                client.close();
            });
        });
    });
});

const insertProducts = function(db, callback) {
    const collection = db.collection('products');
    collection.insertMany([
        {name: "Game", price: 50, type: "item", desc: "video games"},
        {name: "Phone", price: 700, type: "item", desc: "iPhone 6s"},
        {name: "PC", price: 1500, type: "item", desc: "Gaming PC"}
    ], function(err, result){
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 products into the collection");
        callback(result);
    });
}

const findProducts = function(db, callback) {
    const collection = db.collection('products');
    collection.find({'name': "Phone"}).toArray(function(err, prods){
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(prods);
        callback(prods);
    });
}

const updateProducts = function(db, callback) {
    const collection = db.collection('products');
    collection.updateOne({name : "Game"}
    , { $set: {name: "Console"} }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("updated product with the field name console");
    });
}

const removeProducts = function(db, callback) {
    const collection = db.collection('products');
    collection.deleteOne({ name : "PC"}, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the product with the field name PC");
        callback(result);
    });
}
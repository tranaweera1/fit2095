let express = require('express');
let app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.use(express.static('images'));
app.use(express.static('css'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


// MONGODB CLIENT CONNECTION

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('fi2095table');
    }
});
zs

// NAVIGATION GET REQUESTS


app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/list', function (req, res) {
    db.collection("parcels").find({}).toArray(function (err, result) {
        console.log(result);
        res.render('listparcels.html', {parcel: result});
    }); 
});

app.get('/addparcel', function (req, res) {
    res.render('addparcel.html');
});

app.get('/deleteparcel', function (req, res) {
    res.render('deleteparcel.html')
});

app.get('/updateparcel', function (req, res) {
    res.render('updateparcel.html')
});

app.get('/error', function (req, res) {
    res.render('404.html');
});

// END NAVIGATION GET REQUESTS

// FORM POST REQUESTS

app.post('/parcelpost', async function (req, res) {
    db.collection("parcels").insertOne({
        sender: req.body.sender,
        address: req.body.address,
        weight: req.body.weight,
        fragile: req.body.fragile,
        cost: req.body.cost
    })

    db.collection("parcels").find({}).toArray(function (err, result) {
        console.log(result);
        res.render('listparcels.html', {parcel: result});
    });
});

app.post('/deleteparcel', async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;
    let id = req.body.idvalue;
    
    db.collection("parcels").deleteMany({ _id: new ObjectId(id)})
        
})

app.post('/deleteparcelbysender', async function (req, res) {
    
    let sender = req.body.sender;
 
    db.collection("parcels").deleteMany({ sender: sender});
})

app.post('/deleteparcelbyidandweight', async function (req, res) {
    
    const ObjectId = require('mongodb').ObjectId;
    let id = req.body.idvalue;
    let weight = req.body.weight;
 
    db.collection("parcels").deleteMany({_id: new ObjectId(id), weight: weight})}
      
)

app.post('/updateparcel', async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;
    
    let id = req.body.id;
    let name = req.body.sender;
    let address = req.body.address;
    let weight = req.body.weight;
    let fragile = req.body.fragile;
    let cost = req.body.cost;

    db.collection("parcels").updateOne(
        { _id: new ObjectId(id)}, 
        { $set: {sender: name, address: address, weight: weight, fragile: fragile, cost: cost },}, { upsert: false }, function (err, result) {
            db.collection("parcels").find({}).toArray(function (err, result) {
                console.log(result);
                res.render('listparcels.html', {parcel: result});
            });
    });    
    
})

// END FORM POST REQUESTS

app.listen(8080);   // PORT NUMBER

// INVALID PATH NAMES

app.all('/*', function(req, res) {
    res.render('invalid.html');
});



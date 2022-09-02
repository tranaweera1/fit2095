let express = require('express');
let app = express();
const mongoose = require('mongoose');
const path = require("path");

// MIDDLEWARE

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.use(express.static('images'));
app.use(express.static('css'));


app.use(express.urlencoded({extended: true}));
app.use(express.json());


// MODELS

const Parcel = require("./models/Parcel");


// Mongodb connection

    mongoose.connect('mongodb://localhost/productDB', function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        } else {
            console.log("succuessfully connected to Database")
        }
    })

// GET ENDPOINTS

app.get('/', function (req, res) {
    res.render('index.html');
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

// CREATE

app.post('/parcelpost', async function (req, res) {
    const newParcel = new Parcel ({
        sender: req.body.sender,
        address: req.body.address,
        weight: req.body.weight,
        fragile: req.body.fragile,
        cost: req.body.cost
    })

    try {
        const parcel = await newParcel.save();
        const parcels = await Parcel.find();
        res.render("listparcels.html", {parcel: parcels});
        console.log("New parcel is successfully saved in database");
    } catch (err) {
        res.status(500).json(err);
    }
});


// LIST PARCELS

app.get('/list', async function (req, res) {

    try {
        const parcels = await Parcel.find();
        console.log(parcels);
        res.render('listparcels.html', {parcel: parcels});
     } catch (err) {
         res.status(500).json(err);
     }
});




// LIST PARCELS BY WEIGHT RANGE

app.post('/listrange', async function (req, res) {
    
    try {
        const parcels = await Parcel.find({
            weight: {
                $lte: req.body.max, 
                $gte: req.body.min
            }
        });
        res.render('listsender.html', {parcel: parcels});
     } catch (err) {
         res.status(500).json(err);
     }
});


// LIST PARCELS BY SENDER


app.post('/listsender', async function (req, res) {
    
    try {
        const parcels = await Parcel.find({ sender: req.body.sender });
        res.render('listsender.html', {parcel: parcels});
     } catch (err) {
         res.status(500).json(err);
     }
});

// DELETE PARCEL BY WEIGHT


app.post('/deleteparcelweight', async function (req, res) {

    try {
        const deletedParcel = await Parcel.deleteMany({ weight: req.body.weight});
        console.log("The Parcel has been deleted");
        const parcels = await Parcel.find();
        res.render("listsender.html", {parcel: parcels});
    } catch (err) {
        res.status(201).json(err);
    }

})

// DELETE PARCEL BY SENDER 

app.post('/deleteparcelbysender', async function (req, res) {

    try {
        const deletedParcel = await Parcel.findOneAndDelete({ sender: req.body.sender});
        console.log("The Parcel has been deleted");
        const parcels = await Parcel.find();
        res.render("listsender.html", {parcel: parcels});
    } catch (err) {
        res.status(201).json(err);
    }

})

// DELETE PARCEL BY ID

app.post('/deleteparcel', async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;
    let id = req.body.idvalue;
    
    try {
        await Parcel.findByIdAndDelete(new ObjectId(id));
        console.log("The Parcel has been deleted");
        const parcels = await Parcel.find();
        res.render("listsender.html", {parcel: parcels});
    } catch (err) {
        res.status(201).json(err);
    }
})


// UPDATE PARCEL BY ID

app.post('/updateparcel', async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;
    let id = req.body.id;
    try {
        const updatedParcel = await Parcel.findByIdAndUpdate(
            new ObjectId(id), 
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(201).json(updatedParcel);
    } catch (err) {
        res.status(201).json(err);
    }
    
})


// PORT NUMBER 

app.listen(8080); 

// INVALID PATHNAME

app.all('/*', function(req, res) {
    res.render('invalid.html');
});

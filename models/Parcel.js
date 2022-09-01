const mongoose = require("mongoose");


const parcelSchema = mongoose.Schema({
    sender: String,
    address: String,
    weight: Number,
    fragile: Boolean,
    cost: Number
});


module.exports = mongoose.model("Parcel", parcelSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Building schema
const buildingSchema = new Schema({
    ID:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    File: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    Description: {
        type: String,
        required: true
    }
});

// Create the Building model
const Building = mongoose.model('Building', buildingSchema);

// Export the Building model
module.exports = Building;

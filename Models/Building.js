const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the building schema
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

// Create the building model
const building = mongoose.model('building', buildingSchema);

// Export the building model
module.exports = building;

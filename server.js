const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();
const users = require('./routes/users ');

// Initialize the Express application
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Middleware to handle CORS
app.use(cors());

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoURI is not defined');
    process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the building schema and model
const Schema = mongoose.Schema;
const buildingSchema = new Schema({
    ID: {
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
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    Description: {
        type: String,
        required: true
    }
});
const Building = mongoose.model('Building', buildingSchema);

// Create a new building
app.post('/buildings', async (req, res) => {
    try {
        const { ID, name, Description, lat, lng, File } = req.body;
        const coordinates = { lat, lng };

        // Create a new building object
        const newBuilding = new Building({
            ID,
            name,
            File,
            coordinates,
            Description
        });

        // Save the new building to the database
        await newBuilding.save();

        // Send the saved building object as a response
        res.status(201).json(newBuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all buildings
app.get('/buildings', async (req, res) => {
    try {
        const buildings = await Building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a single building by ID
app.get('/buildings/:id', async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a building by value
app.get('/buildings/search/:SearchQuery', async (req, res) => {
    try {
        const buildings = await Building.find({ name: req.params.SearchQuery });
        if (!buildings) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a building by ID
app.put('/buildings/:id', async (req, res) => {
    try {
        const { name, File, coordinates, Description } = req.body;
        const building = await Building.findByIdAndUpdate(
            req.params.id,
            { name, File, coordinates, Description },
            { new: true, runValidators: true }
        );
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Find by coordinates
app.get('/buildings/coordinates/:lat/:lng', async (req, res) => {
    try {
        const { lat, lng } = req.params;
        const buildings = await Building.find({ "coordinates.lat": lat, "coordinates.lng": lng });
        if (!buildings) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a building by ID
app.delete('/buildings/:id', async (req, res) => {
    try {
        const building = await Building.findByIdAndDelete(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json({ message: 'Building deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Use the users router for requests to the /users path
app.use('/users', users);

// Define the port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

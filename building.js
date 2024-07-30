const express = require('express');
const router = express.Router();
const building = require('../Backend/Models/Building');
const multer = require('multer');
const uploads = require('../Backend/Middleware/Multer');
const uploadOnCloudinary = require('../Backend/Services/cloudnary');

// Create a new building
router.post('/', uploads.single('File'), async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.body);

        const { ID, name, Description, lat, lng } = req.body;
        console.log(ID, name, Description, lat, lng);

        const File = req.file;
        console.log(File.path);

        const coordinates = { lat, lng };

        // Upload the file to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(File.path);
        console.log(cloudinaryResponse.url);

        // Create a new building object
        const newbuilding = new building({
            ID,
            name,
            File: cloudinaryResponse.url,
            coordinates,
            Description
        });

        // Save the new building to the database
        await newbuilding.save();

        // Send the saved building object as a response
        res.status(201).json(newbuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all buildings
router.get('/', async (req, res) => {
    try {
        const buildings = await building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a single building by ID
router.get('/:id', async (req, res) => {
    try {
        const building = await building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a building by value
router.get('/search/:SearchQuery', async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.params.SearchQuery);
        const buildings = await building.find({ name: req.params.SearchQuery });
        if (!buildings) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        console.log(error);
    }
});

// Update a building by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, File, coordinates, Description } = req.body;
        const building = await building.findByIdAndUpdate(
            req.params.id,
            { name, File, coordinates, Description },
            { new: true, runValidators: true }
        );
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Find by coordinates
router.get('/coordinates/:lat/:lng', async (req, res) => {
    try {
        const { lat, lng } = req.params;
        const buildings = await building.find({ "coordinates.lat": lat, "coordinates.lng": lng });
        if (!buildings) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a building by ID
router.delete('/:id', async (req, res) => {
    try {
        const building = await building.findByIdAndDelete(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json({ message: 'building deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

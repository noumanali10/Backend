const express = require('express');
const router = express.Router();
const Building = require('../Models/Building');

// Create a new building
router.post('/', async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.body);
        const { ID, name, Description, fileUrl } = req.body;
        const { lat, lng } = req.body.coordinates;
        console.log(ID, name, Description, lat, lng);
     
        const coordinates = {   
            lat,
            lng
        }
  
        // Create a new building object
        const newBuilding = new Building({
            ID,
            name,
            File:fileUrl, // Save the file path directly
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
router.get('/', async (req, res) => {
    try {
        const buildings = await Building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a single building by ID
router.get('/:id', async (req, res) => {
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
router.get('/search/:SearchQuery', async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.params.SearchQuery);
        const buildings = await Building.find({ name: req.params.SearchQuery });
        if (!buildings) {
            return res.status(404).json({ error: 'Building not found' });
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
router.get('/coordinates/:lat/:lng', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;

const express = require('express');
const router = express.Router();
const Building = require('../Models/Building');
const multer = require('multer'); // Add this line
const uploads =require('../Middleware/Multer');
const uploadOnCloudinary = require('../Services/cloudnary');
 // Add this line




// Create a new building
router.post('/', uploads.single('File'), async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.body);
        // console.log(req.file);
      const { ID, name, Description,lat,lng } = req.body;
      console.log(ID, name, Description,lat,lng);
// console.log('Manual',coordinates);
// console.log("lat",coordinates.lat);
// console.log("lng",coordinates.lng);
     
      

      const File = req.file;
      console.log(File.path);
    // const File= "helll.jpg";

    const coordinates = {   
        lat,
        lng
    }
  
    //   upload the file to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(File.path);
      console.log(cloudinaryResponse.url);
      // Create a new building object

      const newBuilding = new Building({
        ID,
        name,
        File: cloudinaryResponse.url , // Save the Cloudinary URL
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

//Read a building by value
router.get('/search/:SearchQuery', async (req, res) => {
    try{
        console.log("Hit");
       console.log(req.params.SearchQuery);
        const buildings = await Building.find({name: req.params.SearchQuery});
        if(!buildings){
            return res.status(404).json({error: 'Building not found'});
        }
        res.status(200).json(buildings);
    }
    catch(error){
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

// find by coordinates
router.get('/coordinates/:lat/:lng', async (req, res) => {
    try {
        lat = req.params.lat;
        lng = req.params.lng;
        const coordinates = {
            lat: typeof(string).lat,
            lng: typeof(string).lng
        }

        console.log("Hit");
        const buildings = await Building.find({ "coordinates": coordinates  });
        if (!buildings) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// give me endpoint to search by coordinates


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

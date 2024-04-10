const express = require("express")
const axios = require("axios")
const router = express.Router()

// Get nearby places around the marker
router.get('/api/places/nearby/search', async (req, res) => {
    const lat = req.query.lat
    const lng = req.query.lng

    try {
        const result = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 2000,
                type: `restaurant|cafe|bar|night_club|bowling_alley|movie_theater|tourist_attraction|park|amusement_park|
                        aquarium|`,
                key: "AIzaSyCpBPMtC5bqLctASD__Hth5ru00ns3aRdM"
              }
        }) 
        res.status(200).send(result.data.results)
    } catch (err) {
        console.error('Error fetching nearby places:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// Get the place from marker
router.get('/api/places/marker/search', async (req, res) => {
    const placeId = req.query.placeId
    
    try {
        const result = await axios.get(`https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName&key=AIzaSyCpBPMtC5bqLctASD__Hth5ru00ns3aRdM`)
        res.status(200).send(result.data)
    } catch (err) {
        console.error('Error fetching marked place:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// Get address of selected place using coordinates
router.get('/api/places/selected/address', async (req, res) => {
    const lat = req.query.lat
    const lng = req.query.lng

    try {
        const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCpBPMtC5bqLctASD__Hth5ru00ns3aRdM`)
        res.status(200).send(result.data)
    } catch (err) {
        console.error('Error fetching marked place:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

module.exports = router;
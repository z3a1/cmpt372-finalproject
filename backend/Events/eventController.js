const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Location = mongoose.model("Location");
const Attendee = mongoose.model("Attendee");
const User = mongoose.model("User");
const Friend = mongoose.model("Friend");

// Returns the location id if it exists, otherwise creates and returns a new location
async function getOrCreateLocation(location) {
    try {
        const existingLocation = await Location.findOne(location)
        if (!existingLocation) {
            const newLocation = new Location(location)
            return await newLocation.save()
                .then(savedLocation => {
                    console.log("Location saved: ", savedLocation)
                    return savedLocation;
                })
        } else {
            console.log("Location already exists: ", existingLocation)
            return existingLocation;
        }
    } catch (err) {
        console.error("Error getting or creating location: ", err)
        throw err;
    }
}

// Create a package containing event, user, and location
const getEventPackages = async (events) => {
    let eventPackages = []
    for (let event of events) {
        const user = await User.findById(event.creator_id);
        const location = await Location.findById(event.location_id)
        const package = { event, user, location }
        eventPackages.push(package)
    }
    return eventPackages
}

// Create a package containing event, user, location, and attendees
const getEventPackagesWithAttendee = async (events, userId) => {
    let eventPackages = []
    for (let event of events) {
        const user = await User.findById(event.creator_id);
        const location = await Location.findById(event.location_id)
        const attendee = await Attendee.findOne({ event_id: event._id, user_id: userId })
        const package = { event, user, location, attendee }
        eventPackages.push(package)
    }
    return eventPackages
}

module.exports = { getOrCreateLocation, getEventPackages, getEventPackagesWithAttendee }
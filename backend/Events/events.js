const express = require("express")
const router = express.Router()
const dayjs = require('dayjs')

const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Location = mongoose.model("Location");
const Attendee = mongoose.model("Attendee");
const User = mongoose.model("User");

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

// Create an event with location and attendees
router.post("/api/event/create", async (req, res) => {
    const formData = req.body
    const { creatorId, eventName, placeName, address, dateTime, friends, visibility, description } = formData

    // Send form data to database collections
    try {   
        const location = await getOrCreateLocation({ name: placeName, address: address })
        console.log("Location: ", location)
        console.log(friends)

        const event = {
            creator_id: new mongoose.Types.ObjectId(creatorId),
            name: eventName,
            location_id: location._id,
            date_time: dayjs(dateTime, "MMM D, YYYY h:mm A").toDate(),
            friends: friends,
            visibility: visibility,
            description: description   
        }

        // Create Event
        const existingEvent = await Event.findOne(event);
        if (!existingEvent) {
            const newEvent = new Event(event)
            await newEvent.save()
                .then(savedEvent => {
                    console.log("Event saved: ", savedEvent)
                    // Add attendees to event
                    friends.forEach(async (friend) => {
                        const attendee = {
                            event_id: savedEvent._id,
                            user_id: friend._id,
                            status: 'invited'
                        }
                        const newAttendee = new Attendee(attendee)
                        await newAttendee.save()
                            .then(savedAttendee => console.log("Attendee saved: ", savedAttendee))
                            .catch(err => console.error("Error saving attendee: ", err))
                    })
                })
            res.status(201).json({ newEvent, formData })
        } else {
            console.log("Event already existed: ", existingEvent);
            res.status(200).json({ existingEvent, formData })
        }
    } catch (err) {
        console.error('Error creating new event:', err);
        res.status(500).json({ err: 'Failed to create a new event' });
    }
})

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

// Get the list of created events for user
router.get("/api/event/created", async (req, res) => {
    const userId = req.query.id
    const creatorId = new mongoose.Types.ObjectId(userId)

    try {
        const events = await Event.find({ creator_id: creatorId });
        const eventPackages = await getEventPackages(events)
        res.status(200).json({ eventPackages })
    } catch (err) {
        console.error('Error retrieving created events:', err);
        res.status(500).json({ err: 'Failed to fetch created events for user' });
    }
})

// Get the list of invited events for user
router.get("/api/event/invited", async (req, res) => {
    const userId = req.query.id

    try {
        const invitedEvents = await Attendee.find({ user_id: userId });
        let events = invitedEvents.map(async (invitedEvent) => await Event.findById(invitedEvent.event_id))
        const eventPackages = await getEventPackages(events)
        res.status(200).json({ eventPackages })
    } catch (err) {
        console.error('Error retrieving invited events:', err);
        res.status(500).json({ err: 'Failed to fetch invited events for user' });
    }
})

// Get event by id
router.get("/api/event", async (req, res) => {
    const event_id = req.query.id;

    try {
        const event = await Event.findById(event_id)
        const location = await Location.findById(event.location_id)
        res.status(200).json({ event, location })
    } catch (err) {
        console.error('Error fetching event:', event_id, err);
        res.status(500).json({ err: 'Failed to fetch event and location data' });
    }
})

// Edit event by id
router.post("/api/event/edit", async (req, res) => {
    const event_id = req.query.id;
    const { eventName, placeName, address, dateTime, friends, visibility, description } = req.body

    try {
        const location = await getOrCreateLocation({ name: placeName, address: address })
        const editedEvent = {
            name: eventName,
            location_id: location._id,
            date_time: dateTime,
            friends: friends,
            visibility: visibility,
            description: description
        }

        // TODO: Update friends

        // Update event
        await Event.findByIdAndUpdate(event_id, editedEvent)
            .then(updatedEvent => {
                res.status(200).json({ updatedEvent })
            })
    } catch (err) {
        console.error('Error patching event:', event_id, err);
        res.status(500).json({ err: 'Failed to patch event' });
    }
})

// Delete event by id
router.delete("/api/event/delete", async (req, res) => {
    const event_id = req.query.id;

    try {
        const event = await Event.findByIdAndDelete(event_id)
        console.log("Deleted event:", event)

        const attendees = await Attendee.deleteMany({ event_id: event_id })
        console.log("Deleted all event attendees:", attendees)
        res.status(200).json({ event })
    } catch (err) {
        console.error('Error deleting event:', event_id, err);
        res.status(500).json({ err: 'Failed to delete event' });
    }
})

module.exports = router;
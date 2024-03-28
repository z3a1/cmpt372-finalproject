const express = require("express")
const router = express.Router()
const moment = require('moment');

const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Location = mongoose.model("Location");
const Attendee = mongoose.model("Attendee");

// Create an event with location and attendees
router.post("/api/event/create", async (req, res) => {
    const formData = req.body
    const { eventName, placeName, address, dateTime, friends, visibility } = formData

    // Send form data to database collections
    try {   
        let location_id;
        const location = { 
            name: placeName, 
            address: address 
        };

        // Create Location
        const existingLocation = await Location.findOne(location);
        if (!existingLocation) {
            const newLocation = new Location(location)
            await newLocation.save()
                .then(savedLocation => {
                    console.log("Location saved: ", savedLocation)
                    location_id = savedLocation._id;
                })
                .catch(err => console.error("Error saving location: ", err));
        } else {
            console.log("Location already existed: ", existingLocation);
            location_id = existingLocation._id;
        }

        const event = {
            event_name: eventName,
            location_id: location_id,
            // add description
            event_date: moment(dateTime).format('DD MMM YYYY hh:mm A'),
            visibility: visibility
        }
        
        // Create Event
        const existingEvent = await Event.findOne(event);
        if (!existingEvent) {
            const newEvent = new Event(event)
            await newEvent.save()
                .then(savedEvent => {
                    console.log("Event saved: ", savedEvent)

                    // TODO: Add once friends function is added
                    // Add attendees to event
                    // friends.forEach(async (friend, index) => {
                    //     const attendee = {
                    //         event_id: savedEvent._id,
                    //         user_id: friend._id,
                    //         status: 'invited'
                    //     }
                    //     const newAttendee = new Attendee(attendee)
                    //     await newAttendee.save()
                    //         .then(savedAttendee => console.log("Attendee saved: ", savedAttendee))
                    //         .catch(err => console.error("Error saving attendee: ", err))
                    // })
                })
                .catch(err => console.error("Error saving event: ", err))
            
            res.status(201).json({
                submissionText: 'Successfully created a new event',
                formData: formData
            })
        } else {
            console.log("Event already existed: ", existingEvent);
            res.status(200).json({
                submissionText: 'Event already existed',
                formData: formData
            })
        }
    } catch (err) {
        console.error('Error creating new event:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// TODO: Get list of created events
router.get("/api/event/created", async (req, res) => {
    const user = req.body

    try {
        console.log("finding created events...")
        const createdEvents = await Event.find({ creator_id: user._id });
        console.log(createdEvents)
        res.status(200).json({ createdEvents })
    } catch (err) {
        console.error('Error retrieving created events:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// TODO: Get list of invited events
router.get("/api/event/invited", async (req, res) => {
    const user = req.body

    try {
        console.log("finding invited events...")
        const invitedEvents = await Attendee.find({ user_id: user._id });
        console.log(invitedEvents)

        // get the event_id of invitedEvents
        // find all events of event_id
        // return
    } catch (err) {
        console.error('Error retrieving invited events:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// View event by id
router.get("/api/event/view", async (req, res) => {
    const event_id = req.query.eventId;

    try {
        console.log("Viewing event...", event_id)
        await Event.findById(event_id)
            .then(async event => {
                console.log(event);
                await Location.findById(event.location_id)
                    .then(location => {
                        console.log(location)
                        res.status(200).json({ event, location })
                    })
            })
            .catch(err => console.error("Error viewing event: ", err))
    } catch (err) {
        console.error('Error retrieving event:', event_id, err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

// Delete event by id
router.delete("/api/event/delete", async (req, res) => {
    const event_id = req.query.eventId;

    try {
        console.log("Deleting event...", event_id)
        await Event.findOneAndDelete(event_id)
            .then(event => console.log("Deleted event: ", event))
            .catch(err => console.error("Error viewing event: ", err))
    } catch (err) {
        console.error('Error deleting event:', event_id, err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

module.exports = router;
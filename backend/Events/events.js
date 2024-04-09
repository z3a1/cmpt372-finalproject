const express = require("express")
const router = express.Router()
const dayjs = require('dayjs')

const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Location = mongoose.model("Location");
const Attendee = mongoose.model("Attendee");
const User = mongoose.model("User");
const Friend = mongoose.model("Friend");

const EventController = require('./eventController')

// Create an event with location and attendees
router.post("/api/event/create", async (req, res) => {
    const formData = req.body
    const { creatorId, eventName, placeName, address, dateTime, friends, visibility, description } = formData

    // Send form data to database collections
    try {   
        const location = await EventController.getOrCreateLocation({ name: placeName, address: address })

        const event = {
            creator_id: new mongoose.Types.ObjectId(creatorId),
            name: eventName,
            location_id: location._id,
            date_time: dayjs(dateTime, "MMM D, YYYY h:mm A").toDate(),
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
                        const friendUser = await User.findOne({ username: friend })
                        const attendee = {
                            event_id: savedEvent._id,
                            user_id: friendUser._id,
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

// Get the list of created events for user
router.get("/api/event/created", async (req, res) => {
    const userId = req.query.id
    const creatorId = new mongoose.Types.ObjectId(userId)

    try {
        const events = await Event.find({ creator_id: creatorId });
        const eventPackages = await EventController.getEventPackages(events)
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

        // Get events
        let events = []
        for (let invitedEvent of invitedEvents) {
            const event = await Event.findById(invitedEvent.event_id)
            events.push(event)
        }

        const eventPackages = await EventController.getEventPackagesWithAttendee(events, userId)
        res.status(200).json({ eventPackages })
    } catch (err) {
        console.error('Error retrieving invited events:', err);
        res.status(500).json({ err: 'Failed to fetch invited events for user' });
    }
})

// Get all public events of friends where the user is not invited
router.get("/api/event/friends/public", async (req, res) => {
    const userId = req.query.id

    try {
        const allAcceptedFriends = await Friend.find({ user_id: userId, status: "accepted" })
        console.log("all accepted friends:", allAcceptedFriends)

        let publicEvents = []
        for (let friend of allAcceptedFriends) {
            console.log("friend:", friend.friend_id)

            // Get friend's invited public events
            const friendInvitedEvents = await Attendee.find({ user_id: friend.friend_id, status: "invited" || "confirmed" })
            for (const invitedEvent of friendInvitedEvents) {
                const publicEvent = await Event.findOne({ _id: invitedEvent.event_id, visibility: "public" })

                // Check if user is already added to event
                const userAlreadyInvitedEvent = await Attendee.findOne({ user_id: userId, event_id: publicEvent._id })
                if (!userAlreadyInvitedEvent) {
                    publicEvents.push(publicEvent)
                }
            }

            // Get friend's created public events
            const friendCreatedEvents = await Event.find({ creator_id: friend.friend_id, visibility: "public" })
            for (const createdEvent of friendCreatedEvents) {
                // Check if user is already added to event
                const userAlreadyInvitedEvent = await Attendee.findOne({ user_id: userId, event_id: createdEvent._id })
                if (!userAlreadyInvitedEvent) {
                    publicEvents.push(createdEvent)
                }
            }
        }
        res.status(200).json({ publicEvents })
    } catch (err) {
        console.error('Error retrieving public events of friends:', err);
        res.status(500).json({ err: 'Failed to fetch public events of friends for user' });
    }
})

// Get event by id
router.get("/api/event", async (req, res) => {
    const event_id = req.query.id;

    try {
        const event = await Event.findById(event_id)
        const location = await Location.findById(event.location_id)
        const eventAttendees = await Attendee.find({ event_id: event_id })

        // Get users from eventAttendees
        let attendees = []
        for (let attendee of eventAttendees) {
            const user = await User.findById(attendee.user_id)
            attendees.push({user, attendee})
        }
        
        res.status(200).json({ event, location, attendees })
    } catch (err) {
        console.error('Error fetching event:', event_id, err);
        res.status(500).json({ err: 'Failed to fetch event and location data' });
    }
})

// Edit event by id
router.post("/api/event/edit", async (req, res) => {
    const event_id = req.query.id;
    const { eventName, placeName, address, dateTime, attendees, visibility, description } = req.body

    try {
        const location = await EventController.getOrCreateLocation({ name: placeName, address: address })
        const editedEvent = {
            name: eventName,
            location_id: location._id,
            date_time: dateTime,
            visibility: visibility,
            description: description
        }

        // Delete all attendees
        await Attendee.deleteMany({ event_id: event_id })

        // Add new attendees
        attendees.forEach(async (attendee) => {
            const user = await User.findOne({ username: attendee })
            const newAttendee = {
                event_id: event_id,
                user_id: user._id,
                status: 'invited'
            }
            const attendeeModel = new Attendee(newAttendee)
            await attendeeModel.save()
                .then(savedAttendee => console.log("Saved attendee:", savedAttendee))
                .catch(err => console.error("Error saving attendee:", err))
        })

        // Update event
        await Event.findByIdAndUpdate(event_id, editedEvent)
            .then(updatedEvent => {
                res.status(200).json({ updatedEvent })
            })
    } catch (err) {
        console.error('Error editing event:', event_id, err);
        res.status(500).json({ err: 'Failed to edit event' });
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

// Update attendee status
router.post("/api/event/attendee/status", async (req, res) => {
    const { eventId, userId, status } = req.body

    try {
        const attendee = await Attendee.findOne({ event_id: eventId, user_id: userId })
        const updatedAttendee = await Attendee.findByIdAndUpdate(attendee._id, { status: status })
        console.log("updated attendee:", updatedAttendee)
        res.status(200)
    } catch (err) {
        console.error('Error updating attendee status:', err);
        res.status(500).json({ err: 'Failed to update attendee status' });
    }
})

// Get attendee
router.get("/api/event/attendee", async (req, res) => {
    const { eventId, userId } = req.query

    try {
        const attendee = await Attendee.findOne({ 
            event_id: new mongoose.Types.ObjectId(eventId),
            user_id: new mongoose.Types.ObjectId(userId)
        })
        res.status(200).json({ attendee })
    } catch (err) {
        console.error('Error fetching attendee:', err);
        res.status(500).json({ err: 'Failed to fetch attendee' });
    }
})

module.exports = router;
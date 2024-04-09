var mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')
var Schema = mongoose.Schema
require('dotenv').config()

var userSchema = new Schema({
    username: {type: String, unique: true, required: 'Username cannot be empty!'},
    fname: String,
    lname: String,
    email: {type: String, unique: true, required: 'User must have an email!'},
    role: {type: String, enum:['Member','Admin'], default: 'Member'},
    password: {type: String, unique: true, required: 'User needs a password!!!'}

})

var friendSchema = new Schema({
    user_id: {
        type: 'ObjectId',
        ref:'User'
    },
    friend_id: {
        type: 'ObjectId', 
        ref:'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
})

var locationSchema = new Schema({
    location_id: 'UUID',
    name: String,
    address: String,
    city: String,
    stateProvince: String,
    country: String
})

var eventSchema = new Schema({
    event_id: 'UUID',
    name: String,
    creator: {type: 'UUID', ref:'User'},
    title: String,
    description: String,
    location_id: {type: 'UUID', ref:'Location'},
    creation_date: Date,
    deletion_date: Date
})

var attendeeSchema = new Schema({
    event_id: {type: 'UUID', ref:'Location'},
    user_id: {type: 'UUID', ref:'User'},
    status: {type: String, enum: ['invited','confirmed','denied','cancelled']}
})

var videoSchema = new Schema({
    video_id: String
})

var likedVideoSchema = new Schema({
    user_id: { type: String, ref: 'User' },
    video_id: { type: String, ref: 'Video' }
})

const messages = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User',userSchema)
const Friend = mongoose.model('Friend',friendSchema)
const Location = mongoose.model('Location',locationSchema)
const Event = mongoose.model('Event',eventSchema)
const Attendee = mongoose.model('Attendee',attendeeSchema)
const Video = mongoose.model('Video', videoSchema)
const LikedVideo = mongoose.model('LikedVideo', likedVideoSchema)
const Messages = mongoose.model('Messages', messages)


const initializeDB = () => {
    mongoose.connect(process.env.CONNECTION_SECRET)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('MongoDB connection error:', error));
}

module.exports = {
    User,Friend,Location,Event,Attendee,Video,LikedVideo,Messages,initializeDB
}
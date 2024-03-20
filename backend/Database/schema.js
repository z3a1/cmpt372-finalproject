var mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')
var Schema = mongoose.Schema

var userSchema = new Schema({
    user_id: {type: 'UUID', default: () => uuidv4()},
    username: {type: String, unique: true, required: 'Username cannot be empty!'},
    fname: String,
    lname: String,
    email: {type: String, unique: true, required: 'User must have an email!'},
    Role: {type: String, enum:['Member','Admin'], default: 'Member'},

})

var friendSchema = new Schema({
    user_id: {type: 'UUID', ref:'User'},
    friend_id: {type: 'UUID', ref:'User'},
    status: String
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

const User = mongoose.model('User',userSchema)
const Friend = mongoose.model('Friend',friendSchema)
const Location = mongoose.model('Location',locationSchema)
const Event = mongoose.model('Event',eventSchema)
const Attendee = mongoose.model('Attendee',attendeeSchema)

module.exports = {
    User,Friend,Location,Event,Attendee
}
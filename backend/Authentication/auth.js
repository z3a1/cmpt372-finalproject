var LocalStrategy = require('passport-local').Strategy
var passport = require('passport')
var bcrypt = require('bcrypt')
var db = require('../Database/schema')

passport.serializeUser((user,done) => done(null,user))
passport.deserializeUser((user,done) => {return done(null,user)})

passport.use(new LocalStrategy({usernameField: 'email', session: false},
async function(email,pass,done) {
    await db.User.findOne({email: email}).then((user,err) => {
        if(err != undefined || !err){
            return done(err,null)
        }
        else{
            bcrypt.compare(pass,user.password).then( result => {
                console.log(result)
                if(result){
                    return done(null,user)
                }
                else{
                    return done(null,false)
                }
            })
        }
    })
}
))
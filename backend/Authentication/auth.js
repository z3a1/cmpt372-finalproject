var LocalStrategy = require('passport-local').Strategy
var passport = require('passport')
var db = require('../Database/schema')

passport.serializeUser((user,done) => done(null,user))
passport.deserializeUser((user,done) => done(null,user))

passport.use(new LocalStrategy({usernameField: 'email', session: false},
async function(email,pass,done) {
    try{
        const userResponse = await db.User.find({email: email, password: pass}).then(res => {
            if(!res){
                done(res)
            }
            else{
                done(null,res)
            }
        })
    }
    catch(err){
        done(err)
    }
}
))

/**
 * (err,user) => {
            if(err){
                done(err)
            }
            if(!user){
                done(null,false)
            }
            if(user){
                done(null,user)
            }
        }
 */
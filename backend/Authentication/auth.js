var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')
var db = require('../Database/schema')

function initialize(passport) {
    passport.use(new LocalStrategy({usernameField: 'email', session: true},
        async function(email,pass,done) {
            await db.User.findOne({email: email}).then((user,err) => {
                if(err){
                    done(err,null)
                }
                else{
                    bcrypt.compare(pass,user.password).then( result => {
                        if(result){
                            done(null,user)
                        }
                        else{
                            done(null,false)
                        }
                    })
                }
            })
        }
    ))
    
    passport.serializeUser((user,done) => done(null,user))
    passport.deserializeUser((user,done) => done(null,user))
}

module.exports = initialize
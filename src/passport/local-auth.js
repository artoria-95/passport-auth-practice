const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done)=>{
  
  const user = await User.findOne({email: email});
  if(user){
    return done(null, false, req.flash('registerMessage', 'This email is already taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    await newUser.save();
    done(null, newUser);
  }  
  
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done)=>{
  const user = await User.findOne({email:email});
  if(!user){
    return done(null, false, req.flash('loginMessage', 'User not found'));
  }
  if(!user.comparePassword(password)){
    return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
    }
    done(null, user);
}));
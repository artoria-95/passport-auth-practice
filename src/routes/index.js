const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', passport.authenticate('local-register', {
  successRedirect: '/profile',
  failureRedirect: '/register',
  passReqToCallback: true
}));

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: 'login',
  passReqToCallback: true
}));


//--- rutas autenticadas---------------
router.use((req, res, next)=>{
  isAuthenticated(req, res, next);
  next();
});

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});


//----funcion de autenticacion
function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

module.exports = router;
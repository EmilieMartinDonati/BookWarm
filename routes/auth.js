const express = require('express')
const router = express.Router()
const User = require('./../models/User.model')

const bcrypt = require('bcrypt')
const saltRounds = 10

const zxcvbn = require('zxcvbn')


//GET signup route

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

//POST signup route

router.post('/signup',(req, res, next) => {

    const {username, password} = req.body
    if (username ==='' || password ===''){
        res.render('auth/signup', 
                  {errorMessage: 'Please enter a username and a password'}
        )
        
    }
    if (zxcvbn(password).score < 3) {
        res.render('auth/signup',
          {errorMessage: 'Your password is too weak, try again'}
        );
        return;
      }
    else
    User.findOne({ username })
    .then((user) => {
    if ( user !== null ) {
      res.render('auth/signup',{ errorMessage:'This username already exists'});
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
        User.create( { username, password: hashedPassword})
       .then(() => res.redirect('/'))
       .catch((err) => res.render('auth/signup',{ errorMessage:'Error while trying to create a new user'}));
    
   })
   .catch((err) => next(err));

});





module.exports = router

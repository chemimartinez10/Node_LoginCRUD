const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body
    const errors = []
    if(password != confirmpassword){
        errors.push({text:'passwords do not match'})
    }
    if(password.length < 4){
        errors.push({text: 'password must have more than 4 characters'})
    }
    if(!email){
        errors.push({text: 'put an email'})
    }
    if(!name){
        errors.push({text: 'write a name'})
    }
    if(await User.findOne({email: email})){
        errors.push({text: `${email} is already in use`})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirmpassword})
    }
    else{
        const newUser = new User ({name, email, password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'you are in!')
        res.redirect('/users/signin')
    }
})
router.get('/users/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
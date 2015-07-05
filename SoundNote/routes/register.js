var express = require('express');
var router = express.Router();
var User = require('./../models/user');
var bcrypt = require('bcrypt');

router.get('/register', function(req, res) {
    if(req.session.authenticated) {
        req.flash('notif', 'You are already logged in.')
        res.redirect('/');
    }
    res.render('register', {pageTitle: 'Registration',
                            notif: req.flash('notif'),
                            auth: req.session.authenticated});
});

router.post('/register', function(req, res) {
    if (req.body.email != req.body.reemail || req.body.pass != req.body.repass) {
        req.flash('notif', 'The email or passwords do not match,' +
                           ' please try again.');
        res.redirect('/register');
    } else {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.pass, salt, function(err, hash) {
                var user = new User({
                    email: req.body.email,
                    password: hash,
                    points: 0
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);
                        req.flash('notif', 'This email is already taken or the data' +
                                           ' does not match.');
                        res.redirect('/register');
                    } else {
                        req.flash('notif', 'You have successfully registered.')
                        res.redirect('/');
                    }
                });
            });
        });
    };
});

module.exports = router;

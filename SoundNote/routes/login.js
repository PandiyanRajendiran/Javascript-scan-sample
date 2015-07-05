var express = require('express');
var router = express.Router();
var User = require('./../models/user');
var bcrypt = require('bcrypt');
var simple_recaptcha = require('simple-recaptcha');

router.get('/login', function(req, res) {
    if(req.session.authenticated) {
        req.flash('notif', 'You are already logged in.')
    res.redirect('/');
    }
    res.render('login', {pageTitle: 'Login',
        notif: req.flash('notif'),
        auth: req.session.authenticated,
        fail: req.session.fail});
});

router.post('/login', function(req, res) {
    var privateKey = '6LcC6PcSAAAAADJ5vPn0Te-p3sgITH3LKyqogHP1';
    var ip = req.ip;
    var challenge = req.body.recaptcha_challenge_field;
    var response = req.body.recaptcha_response_field;
    var incorrect = false;

    if (req.session.fail >= 3) {
        simple_recaptcha(privateKey, ip, challenge, response, function(err) {
            if (err) {
                incorrect = true;
            }
        });
    }

    if (incorrect) {
        req.flash('notif', 'You have incorrectly entered the captcha');
        res.redirect('/login');
    } else {
        User.findOne({email: req.body.email}, function(err, user) {
            if (err) {console.log(err)}
            if (!user) {
                if (!req.session.fail) {
                    req.session.fail = 1;
                } else {
                    req.session.fail += 1;
                }
                req.flash('notif', 'You have entered an incorrect email' +
                    ' or password.');
                res.redirect('/login');
            } else {
                bcrypt.compare(req.body.pass, user.password, function(err, result) {
                    if (err) {console.log(err)}
                    if (result) {
                        console.log(user.email + ' has logged in!');
                        req.session.user = user.email;
                        req.session.authenticated = true;
                        req.session.fail = 0;
                        req.flash('notif', 'You have successfully logged in.');
                        res.redirect('/');
                    } else {
                        if (!req.session.fail) {
                            req.session.fail = 1;
                        } else {
                            req.session.fail += 1;
                        }
                        req.flash('notif', 'You have entered an incorrect email' +
                            ' or password.');
                        res.redirect('/login');
                    }
                });
            }
        });
    }
});

module.exports = router;

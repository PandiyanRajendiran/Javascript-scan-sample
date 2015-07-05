var express = require('express');
var router = express.Router();
var User = require('./../models/user');

router.get('/games', function(req, res) {
    res.render('games', {pageTitle: 'Games', auth: req.session.authenticated});
});

router.get('/games/:id', function(req, res) {
    var title;
    var gameNum = req.param('id');
    if (gameNum == '1') {
        title = 'Chord Identifier Game';
    } else if (gameNum == '2') {
        title = 'Perfect Pitch Game';
    } else if (gameNum == '3') {
        title = 'Relative Pitch Game';
    } else {
        title = 'Pitch Detection';
    }
    res.render('game' + gameNum, {pageTitle: title, auth: req.session.authenticated});
});

router.put('/games/:submit/:time', function(req, res) {
    var gameNum = req.param('submit');
    if (req.session.authenticated) {
        User.findOne({email: req.session.user},
            function(err, user) {
                user.points = user.points + 1;
                if (gameNum == 1) {
                    user.game_1_points = user.game_1_points + 5;
                } else if (gameNum == 2) {
                    user.game_2_points = user.game_2_points + 5;
                } else if (gameNum == 3) {
                    user.game_3_points = user.game_3_points + 5;
                }
                user.save(function(err) {
                    console.log(user.points);
                    if (err)
                    console.log('Error');
                    else
                    console.log('Incremented');
                });
            });
    }
});

module.exports = router;

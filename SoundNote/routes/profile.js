var express = require('express');
var router = express.Router();
var User = require('./../models/user');

router.get('/profile', function(req, res) {
	if(!req.session.authenticated) {
		req.flash('notif', 'You must be logged in to view that page.')
		res.redirect('/');
	}
    User.findOne({email: req.session.user},
        function(err, user) {
            var pts = user.points;
			var pts_1 = user.game_1_points;
			var pts_2 = user.game_2_points;
			var pts_3 = user.game_3_points;
            res.render('profile', {pageTitle: 'Profile', auth: req.session.authenticated,
                                   user: req.session.user, score: pts, 
								   score1: pts_1,
								   score2: pts_2,
								   score3: pts_3});
        }
    );
});

module.exports = router;
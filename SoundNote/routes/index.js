var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', {pageTitle: 'SoundNote',
    					 auth: req.session.authenticated,
    					 notif: req.flash('notif')});
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res) {
    delete req.session.user;
    delete req.session.authenticated;
    req.flash('notif', 'You have successfully logged out.')
    res.redirect('/');
});

module.exports = router;

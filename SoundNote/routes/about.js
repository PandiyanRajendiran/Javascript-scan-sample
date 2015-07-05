var express = require('express');
var router = express.Router();

router.get('/about', function(req, res) {
    res.render('about', {pageTitle: 'About', auth: req.session.authenticated});
});

module.exports = router;
var express = require('express');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var app = express();

//connect to database
mongoose.connect('localhost/csc309');

//configuration
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(cookieParser());
app.use(session({store: new MongoStore({
				db: 'csc309'}),
                secret: 'I like polar bears',
                resave: true,
                saveUninitialized: true,
                cookie: {maxAge: 3600000}}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(require('./routes/index'));
app.use(require('./routes/about'));
app.use(require('./routes/register'));
app.use(require('./routes/login'));
app.use(require('./routes/logout'));
app.use(require('./routes/profile'));
app.use(require('./routes/games'));

//start server
app.listen(app.get('port'), function() {
    console.log('Server is running on port ' + app.get('port') + '.');
});

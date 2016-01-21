var usersRouter = require('./users');

module.exports = function (app, users) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        console.log("cookies: >>", req.cookies.user);
        if (req.cookies.user == null) {
            res.redirect('/signin');
        }
        else {
            res.render('index');
        }
    });

    app.get('/signin', function (req, res) {
        res.render('signin');
    });

    app.post('/signin', function (req, res) {
        if (users[req.body.name]) {
            res.redirect('/signin');
        }
        else {
            res.cookie('user', req.body.name, {maxAge: 1000*60*60*24*30});
            res.redirect('/');
        }
    });

    usersRouter(app, users);
};


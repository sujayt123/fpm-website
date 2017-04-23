'use strict';

var express = require('express'),
    logger = require('morgan'),
    app = express();

app.use(logger('default'));
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 80;

require('./app/routes.js').setup(app);

var server = app.listen(port, function() {
    console.log('Server listening at http://%s:%s', server.address().address,
        server.address().port);
});
// libs
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.PORT || 3000;

// views config
app.engine('html', nunjucks.render);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));


// config port
app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});

require('./app/routes')(app);

module.exports = app;

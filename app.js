// libs
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// body-parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors config
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

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

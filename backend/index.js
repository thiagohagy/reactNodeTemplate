var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.get('/api/', function(req, res, next) {
  res.json('online');
});

var config = require('./config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  }
);

/*Login de Usuarios*/
app.use('/api/', require('./app/usuario/auth'));

/*Mid para rotas da API verificar JWT*/
var jwt = require('./core/jwt');
app.use('/api/v1', jwt);

/*Modulos*/
/* universal route for uploads*/
jwt.use('/upload', require('./app/upload'));

jwt.use('/users', require('./app/usuario'));
jwt.use('/clients', require('./app/client'));

var id = Number(process.env.id);
var hit = 0;

var port = parseInt(config.initialPort);

server.listen(port, '127.0.0.1');
console.log('Server start: ' + port);
